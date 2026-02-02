import mongoose from "mongoose";

const note = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        userID: {
            type: String,
            required: true
        },
        embedding: {
            type: [Number]
        },
        metadata: {
            tags: [{ type: String, lowercase: true }],
            wordCount: Number,
            lastIndexedAt: Date
        }
    },
    {
        timestamps: true
    }
);

note.index({ userId: 1, createdAt: -1 });

const NoteModel = mongoose.model('note',note)

export default NoteModel;