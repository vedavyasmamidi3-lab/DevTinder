//importing from express modules

const express=require("express");
//getting the function exported from auth.js
const { authAdmin, authUser } = require("./middlewares/auth");


//creating a instance
const app=express();

//global middleware checks for all the requests starts with /admin then if has authorization run to the request called
app.use("/admin",authAdmin);

//getData 
app.get("/admin/getdata",(req,res)=>{
    console.log("Data is fetching");
    res.send("Here is the data");
});
//deleteData
app.get("/admin/deletedata",(req,res)=>{
    
    res.send("Data is deleted");
});

//user 
app.get("/user/login",(req,res)=>{
    res.send("Login successfull");
});
//auth of user needed
app.get("/user/data",authUser,(req,res)=>{
    res.send("Here is the user data");
})

//making the server to listen(live)
app.listen(3000,()=>
{
    console.log("Server is running on port 3000");
});