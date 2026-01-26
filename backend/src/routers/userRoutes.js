import express from "express"
import bcrypt from "bcrypt"
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req,res) => {
    try {

        const {name,email,password} = req.body;
        if( !name || !email || !password ){
            return res.status(400).json({ message : "Please fill all fields"});
        }

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message : "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({name,email,password: hashedPassword});

        await newUser.save();

        res.status(200).json({message: "new User registered successfully!"});

    } catch (error) {
        console.error("Error: ",error);
        res.status(500).json({message: error });
    }

});

router.post("/login", async (req,res) => {
    try {
        
        const {email,password} = req.body;

        if(!email || !password){
            res.status(400).json({message : "Enter proper details"});
        }

        const findUser = await User.findOne({email});

        if(!findUser){
            res.status(404).json({message:"User does not exist"});
        }

        const validate = await bcrypt.compare(password,findUser.password);

        if(validate){
            res.status(200).json({message:"Login Successful!"})
        }else{
            res.status(201).json({message:"Invalid password"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;