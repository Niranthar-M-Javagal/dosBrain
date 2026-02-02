import express from "express"
import connectDB from "./db.js"
import ENV from "../src/lib/env.js"
import userRouter from "./routers/userRoutes.js"
import notesRouter from "./routers/notesRoutes.js"

const app = express();
app.use(express.json());

//sends any request with /user to userRoute router for further routing imported from userRoutes.js in routers folder
app.use("/user",userRouter);

app.use("/notes",notesRouter);

app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.listen(ENV.port, () => {
    console.log(`Listening on port ${ENV.port} `)
});

connectDB();
