import express from "express"
import connectDB from "./db.js"
import ENV from "../src/lib/env.js"

const app = express();

connectDB();

console.log(ENV.port);

app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.listen(ENV.port, () => {
    console.log(`Listening on port ${ENV.port} `)
});

