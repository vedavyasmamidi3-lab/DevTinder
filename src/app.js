//importing from express modules

const express=require("express");

//creating a instance

const app=express();

//Request handlers
app.use("/test",(req,res)=>{
    res.send("Hello from server");
});

app.use("/hello",(req,res)=>{
    res.send("Namasthey");
});

//making the server to listen(live)
app.listen(3000,()=>
{
    console.log("Server is running on port 3000");
});