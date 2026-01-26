import jwt from "jsonwebtoken";
import ENV from "../lib/env.js";

const checkToken = (req,res,next)=> {

    const token = req.headers.authorization?.split(" ")[1];

    if(!token)
    {
        return res.status(401).json({message:"No token, authorization declined"});
    }

    try {
    const decoded = jwt.verify(token, ENV.jwt_secret);
    req.user = decoded;
    return next();
    }catch (error) {
        // If token is expired
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        // If token is malformed or "bad"
        if (error.name === 'JsonWebTokenError' || error instanceof SyntaxError) {
            return res.status(401).json({ message: "Invalid token" });
        }

        console.error("Auth Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }

};

export default checkToken;