import axios from "axios";
import ENV from "../lib/env.js";

const getVector = async (text) => {
    try {
       const response = await axios.post(ENV.embedding_url,{model: "nomic-embed-text",prompt:text});
       return response.data.embedding;
    } catch (error) {
        console.error("Ollama Error",error.message);
        throw error;
    }
};

export default getVector;