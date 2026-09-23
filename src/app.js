//importing from express modules

const express=require("express");

//importing the connectDb fn from db.js

const connectDb=require("./config/db");
const User=require("./models/user");


const app=express();

//api to push data into db
app.post("/signup",async (req,res)=>{
    const user=new User({
        firstName:"Vedavyas",
        lastName:"Mamidi",
        age:19,
        emailId:"vedavyasmamidi3@gmail.com",
        password:"Iamvedavyas@1",
    });
   try{
     await user.save();
    res.send("Data is pushed into db successfully");
   }
   catch(err)
   {
    res.status(400).send("Data uploading failed");
   }
})
//making connection to db
connectDb()
.then(()=>{
console.log("Db connected successfully");
app.listen(3000,()=>
{
    console.log("Server is running on port 3000");
});
})
.catch((err)=>{
    console.log("Db connection failed");
    console.error(err);
})
//making the server to listen(live)
