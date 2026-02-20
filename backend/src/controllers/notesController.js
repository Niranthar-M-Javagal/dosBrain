import Note from "../models/notes.js"
import chunker from "../utils/textChunker.js";
import getVector from "../services/embeddingservice.js";
import Embedding from "../models/embeddings.js";
import cosineSimilarity from "../utils/vectorMath.js";
import axios from "axios";

const postNote = async (req, res) => {
    try {
        const userID = req.user.id;
        const { title, content } = req.body;

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ message: "Bad request, please fill all input fields" });
        }

        // 1. Save the main note first
        const newNote = new Note({ title, content, userID });
        await newNote.save();

        // 2. AI Embedding Pipeline
        try {
            const pieces = chunker(content, 500, 50);
            
            for (let piece of pieces) {
                // FORCE CLEANING: If piece is an array, take the first string
                const cleanPiece = Array.isArray(piece) ? piece[0] : piece;
                
                if (!cleanPiece || typeof cleanPiece !== 'string') continue;

                const vector = await getVector(cleanPiece);

                await Embedding.create({
                    noteId: newNote._id,
                    userID: userID,
                    content: cleanPiece, // Guaranteed string now
                    embedding: vector
                });
            }

            // Send response ONLY after loop completes
            return res.status(201).json({ message: "Note created and embedded successfully" });

        } catch (aiError) {
            console.error("❌ AI Error:", aiError.message);
            // Still send a 201 because the note was saved, but warn about AI
            return res.status(201).json({ message: "Note saved, but AI embedding failed" });
        }

    } catch (error) {
        console.error("Global Error:", error);
        return res.status(500).json({ message: "internal server error", error: error.message });
    }
};

const getNote = async (req,res) => {
    try{
        const notes = await Note.find({userID:req.user.id});
        res.send(notes);
    }
    catch(error){
        res.status(500).json({message:"internal server error",error: error.message});
    }
}

const editNote = async (req,res)=>{
    const { title, content } = req.body;
    const noteId = req.params.id;
    const userID = req.user.id;

    try{

        if(title.trim().length==0||content.trim().length==0)
            return res.status(400).json({message: "Bad request, please fill all input fields"});

        const updateNote = await Note.findOneAndUpdate(
            {_id:noteId,userID:userID},
            {title,content},
            {new:true, runValidators: true}
        );

        if(!updateNote)
            return res.status(404).json({message: "note not found"});
        res.status(200).json({message: "note updated successfully"});

        // 1. Delete old pieces
        await Embedding.deleteMany({ noteId: noteId });

        // 2. Start the AI Pipeline again
        try {
            const pieces = chunker(content, 500, 50);
            for (const piece of pieces) {
                const vector = await getVector(piece);
                await Embedding.create({
                    noteId: updateNote._id,
                    userID: userID,
                    content: piece,
                    embedding: vector
                });
            }
        } catch (error) {
            console.error("AI Update Error:", error.message);
        }
    }
    catch(error){
        res.status(500).json({message:"Internal server error",error: error});
    }
}

const deleteNote = async (req,res)=>{
    const noteID = req.params.id;
    const userID = req.user.id;
    try{
            const deletedNote = await Note.findOneAndDelete({
            _id: noteID,
            userID:userID
        });

        if(!deletedNote)
            return res.status(404).json({message: "note not found"});
                
        await Embedding.deleteMany({ noteId: noteID });

        res.status(200).json({message:"Note deleted successfully"});

    }
    catch(error){
        res.status(500).json({message:"Internal Server Error",error: error});
    }

}

const searchNote = async (req, res) => {
  try {
    const { q } = req.query;
    const userID = req.user.id;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const queryVector = await getVector(q);

    const userEmbeddings = await Embedding.find({ userId: userID });
    console.log(userEmbeddings)

    const results = userEmbeddings.map((emb) => {
      const score = cosineSimilarity(queryVector, emb.embedding);

      return {
        _id: emb.noteId,
        title: emb.title || "Matched Note",
        content: emb.content,
        score,
      };
    });

    const topResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, 7);

    res.status(200).json(topResults);

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const askBrain = async (req, res) => {
    try {
        const { q } = req.query;
        const userID = req.user.id;

        if (!q) {
            return res.status(400).json({ message: "Question is required" });
        }

        // 1. Convert user question into a vector using your existing service
        const queryVector = await getVector(q);

        // 2. Fetch all embeddings belonging to this user
        const userEmbeddings = await Embedding.find({ userID });

        // 3. Calculate similarity scores
        const results = userEmbeddings.map(emb => ({
            content: emb.content,
            noteId: emb.noteId,
            score: cosineSimilarity(queryVector, emb.embedding)
        }));

        // 4. Filter for quality (0.6 is a good balance) and sort by best match
        const contextMatches = results
            .filter(r => r.score > 0.55)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Take top 5 chunks for context

        if (contextMatches.length === 0) {
            return res.status(200).json({ 
                answer: "I checked your notes, but I don't have any information regarding that question.",
                sources: [] 
            });
        }

        // 5. Build the Context string for the LLM
        const contextText = contextMatches.map(m => `- ${m.content}`).join("\n");

        // 6. Send to Ollama (Llama 3.2)
        const prompt = `
            You are a helpful personal assistant. Below are snippets from the user's personal notes.
            Use ONLY these notes to answer the question. If the answer isn't in the notes, say you don't know.
            
            Context:
            ${contextText}

            User Question: ${q}
            Answer:
        `;

        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "llama3.2:latest",
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0, // Keep it precise
                num_predict: 300 // Prevent rambling
            }
        });

        // 7. Resolve Source Titles
        // Get unique Note IDs from the matches
        const uniqueNoteIds = [...new Set(contextMatches.map(c => c.noteId.toString()))];
        
        // Look up the titles for those IDs
        const sourceDetails = await Promise.all(
            uniqueNoteIds.map(async (id) => {
                const note = await Note.findById(id).select('title');
                return { 
                    id: id, 
                    title: note ? note.title : "Unknown Note" 
                };
            })
        );

        // 8. Send the final package
        res.status(200).json({
            answer: response.data.response,
            sources: sourceDetails
        });

    } catch (error) {
        console.error("❌ Brain Error:", error.message);
        res.status(500).json({ 
            message: "The brain is having a headache.", 
            error: error.message 
        });
    }
};

const getNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userID = req.user.id;

        // Find a note that matches the ID AND belongs to the user
        const note = await Note.findOne({ _id: noteId, userID: userID });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching single note:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const noteCont = {postNote,getNote,editNote,deleteNote,searchNote,askBrain,getNoteById};

export default noteCont;