import Note from "../models/notes.js"
import chunker from "../utils/textChunker.js";
import getVector from "../services/embeddingservice.js";
import Embedding from "../models/embeddings.js";
import cosineSimilarity from "../utils/vectorMath.js";
const postNote = async (req,res)=>{
    try {

        //fetch user details from "user" created by authMiddleware 
        const userID = req.user.id;

        //fetch content from request body and check if the title or content is empty 
        const  {title,content} = req.body;
        if(title.trim().length==0||content.trim().length==0)
            return res.status(400).json({message: "Bad request, please fill all input fields"});
 
        const newNote = new Note({title,content,userID});
        await newNote.save();
        res.status(201).json({message:"Note created successfully"});

            try {
                const pieces = chunker(content,500,50);

                for(const piece of pieces){

                    const vector = await getVector(piece);

                    await Embedding.create({
                    noteId: newNote._id,
                    userID: userID,
                    content: piece,
                    embedding: vector
                });

                console.log(`✅ AI: Successfully embedded note ${newNote._id}`);

                }
            } catch (error) {
                console.error("❌ AI Error (Ollama might be down):", error.message);
            }
    
    } catch (error) {
        res.status(500).json({message:"internal server error",error: error});
    }
}

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
        // 1. Define it clearly here (Note the capital ID)
        const userID = req.user.id; 

        if (!q) return res.status(400).json({ message: "search query is required" });

        const queryVector = await getVector(q);

        // 2. Use the exact same variable name here
        // The first 'userID' is the database key, the second is your variable
        const userEmbeddings = await Embedding.find({ userID: userID });

        const results = userEmbeddings.map(emb => {
            const score = cosineSimilarity(queryVector, emb.embedding);
            return {
                content: emb.content,
                noteId: emb.noteId, 
                score
            };
        });

        const topResults = results.sort((a, b) => b.score - a.score).slice(0, 7);
        res.status(200).json(topResults);

    } catch (error) {
        // This is where your "userID is not defined" error was being caught
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const noteCont = {postNote,getNote,editNote,deleteNote,searchNote};

export default noteCont;