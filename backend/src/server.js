import express from "express"
import connectDB from "./db.js"
import ENV from "../src/lib/env.js"
import userRoute from "./routers/userRoutes.js"

const app = express();
app.use(express.json());

app.use("/user",userRoute);

app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.listen(ENV.port, () => {
    console.log(`Listening on port ${ENV.port} `)
});

connectDB();
