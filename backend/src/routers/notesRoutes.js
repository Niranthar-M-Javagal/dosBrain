import express from "express"
import Note from "../models/notes.js"
import checkToken from "../middleware/authMiddleware.js"

const router = express.Router();

//creating a note in the database
router.post("/",checkToken,async (req,res)=>{
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
    } catch (error) {
        res.status(500).json({message:"internal server error",error: error});
    }
});

//pulling the notes of a user from the database
router.get("/",checkToken, async (req,res) => {
    try{
        const notes = await Note.find({userID:req.user.id});
        res.send(notes);
    }
    catch(error){
        res.status(500).json({message:"internal server error",error: error.message});
    }
});

router.patch("/:id",checkToken,async (req,res)=>{
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
    }
    catch(error){
        res.status(500).json({message:"Internal server error",error: error});
    }
});

router.delete("/:id",checkToken,async (req,res)=>{
    const noteID = req.params.id;
    const userID = req.user.id;
    try{
            const deletedNote = await Note.findOneAndDelete({
            _id: noteID,
            userID:userID
        });

        if(!deletedNote)
            return res.status(404).json({message: "note not found"});

        res.status(200).json({message:"Note deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error",error: error});
    }

});

export default router;

