import express from "express"
import bcrypt from "bcrypt"
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import ENV from "../lib/env.js";
import checkToken from "../middleware/authMiddleware.js";

const router = express.Router();

//This is triggered when the user presses register and the frontend sends the post request to "user/register"
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

//This is triggered when the user presses Login and the frontend sends the post request to "user/Login"
router.post("/login", async (req,res) => {
    try {
        
        //checks the request body for email and password and assigns it to the variables
        const {email,password} = req.body;


        //checks if the email and password field is empty, if it is empty, returns a error with status 400
        if(!email || !password){
            return res.status(400).json({message : "Enter proper details"});
        }


        //finds the user with the given email from the mongoDB database
        const findUser = await User.findOne({email});


        //if the user is not present in the datavase returns a error with status 404 not found
        if(!findUser){
            return res.status(404).json({message:"User does not exist"});
        }


        //compares the encrypted password with the password recieved from the frontend using bcrypt and stores result in validate
        const validate = await bcrypt.compare(password,findUser.password);


        //if the password is valid then, the user is logged in and the details are stored as a jsonwebtoken
        if(validate){
            const token = jwt.sign({id : findUser._id},ENV.jwt_secret,{expiresIn: "1D"});
            return res.status(200).json({
                message:"Login Successful!",
                token,
                user: {name: findUser.name, email: findUser.email}
            });
        }
        
        
        else{
            return res.status(201).json({message:"Invalid password"});
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


router.get("/profile",checkToken, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message: "Server Error"});
    }
});

export default router;