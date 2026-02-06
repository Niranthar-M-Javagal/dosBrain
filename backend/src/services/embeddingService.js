import axios from "axios";
import ENV from "../lib/env.js";

const getVector = async (text) => {
    // If 'text' accidentally comes in as an array, take the first item or join it
    const cleanText = Array.isArray(text) ? text.join(" ") : text;

    console.log("SENDING TO OLLAMA:", { type: typeof cleanText, value: cleanText.substring(0, 50) + "..." });

    try {
       const response = await axios.post(ENV.embedding_url, {
           model: "nomic-embed-text:latest",
           prompt: cleanText // Now it's guaranteed to be a string
       });
       return response.data.embedding;
    } catch (error) {
        console.error("Ollama Detail:", error.response?.data);
        throw error;
    }
};

export default getVector;