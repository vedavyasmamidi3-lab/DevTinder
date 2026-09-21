//importing from express modules

const express=require("express");

//creating a instance

const app=express();

//Request handlers

app.get("/hello",(req,res)=>{
    res.send({firstname:"Veda",last:"Vyas"});
})

app.post("/hello",(req,res)=>{
    res.send("Posted successfully");
})
// app.use("/hello",(req,res)=>{
//     res.send("Namasthey");
// });
// app.use("/test",(req,res)=>{
//     res.send("Hello from server");
// });
//making the server to listen(live)
app.listen(3000,()=>
{
    console.log("Server is running on port 3000");
});