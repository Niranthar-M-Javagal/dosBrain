import mongoose from "mongoose";

const embeddingSchema = mongoose.Schema(
    {
        
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
            required: true
        },

        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            required: true
        },

        embedding: {
            type: [Number],
            required: true
        }
    },
    {timestamps: true}
);

embeddingSchema.index({noteId: 1});
embeddingSchema.index({userId: 1});

const Embedding = mongoose.model("Embedding",embeddingSchema);

export default Embedding;