//importing from express modules

const express = require("express");
const bcrypt=require("bcrypt");
//importing the connectDb fn from db.js

const connectDb = require("./config/db");
const User = require("./models/user");
const {validateSignUp}=require("./utils/validation");
const validator=require("validator");

const app = express();

//use of middleware for conversion of json into js
app.use(express.json());
//api to get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      throw new Error("Invalid emailId");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("server error");
  }
});
//get all users in feed
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({}); //{} gives all the data in the db
    res.send(user);
  } catch (err) {
    res.status(404).send("Server error");
  }
});
// api to push data into db (UPDATED FOR DYNAMIC ERROR REPORTING)
app.post("/signup", async (req, res) => {
   try {
    //validation of data
     validateSignUp(req);
   const {firstName,lastName,emailId,password,phoneNum,age}=req.body;
     //encryption of password
    const encryptPass=await bcrypt.hash(password,10);
    console.log(encryptPass);
  
  const user = new User({
    firstName,
    lastName,
    emailId,
    password:encryptPass,
    phoneNum,
    age,
    
  });
 
    await user.save();
    res.send("Data is pushed into db successfully");
  } catch (err) {
    // FIX: Check if Mongoose blocked it due to schema validation rules
        if (err.code === 11000) {
      return res.status(400).send("User with this email_id already exists.");
    }

    if (err.name === "ValidationError") {
      const errorField = Object.keys(err.errors)[0];
      // Sends your exact custom error string back to the user
      return res.status(400).send(err.errors[errorField].message);
    }
       if (err.message) {
      return res.status(400).send(err.message);
    }
    res.status(500).send("Data uploading failed due to a server error");
  }
});

//user login
app.post("/login",async(req,res)=>{
  try{
  const {email,password}=req.body;
   if(!validator.isEmail(email))
   {
    throw new Error("Invalid Email");
   }
   const user=await User.findOne({emailId:email});
   if(!user)
   {
        throw new Error("Invalid credientials");
   }
   //compare  password sent from the user with the password present in the db
   const isPasswordValid=await bcrypt.compare(password,user.password);
   if(!isPasswordValid)
   {
    throw new Error("Invalid credientials");
   }
   else{
    res.send("Login Successfull");
   }
  }
  catch(err)
  {
     res.send("Error: "+err.message);
  }
   
});


//upadation of data
app.patch("/user", async (req, res) => {
  const { user_ID, ...data } = req.body;
  try {
    const updateList = ["age", "skills", "firstName","gender"];
    const fieldsToUpdate = Object.keys(data);

    // 2. Check if every field in the request exists inside updateList
    const isValidOperation = fieldsToUpdate.every((field) =>
      updateList.includes(field),
    );
    if (!isValidOperation) {
      throw new Error("unsuccefull upadation");
    }

    const user = await User.findByIdAndUpdate(user_ID, data, {
      new: true,
      runValidators: true,
    });
    res.send("user upadated successfully");
  } catch (err) {
    res.status(500).send("Upadation failed");
  }
});

//making connection to db
connectDb()
  .then(() => {
    console.log("Db connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Db connection failed");
    console.error(err);
  });
//making the server to listen(live)
