import express from "express"
import checkToken from "../middleware/authMiddleware.js"
import noteController from "../controllers/notesController.js";

const router = express.Router();

router.post("/",checkToken, noteController.postNote);

router.get("/",checkToken, noteController.getNote);

router.get("/search",checkToken,noteController.searchNote);

router.post("/ask",checkToken,noteController.askBrain);

router.get("/:id", checkToken, noteController.getNoteById);

router.patch("/:id",checkToken, noteController.editNote);

router.delete("/:id",checkToken, noteController.deleteNote);

export default router;

