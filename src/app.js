//importing from express modules

const express = require("express");
const bcrypt = require("bcrypt");
//importing the connectDb fn from db.js

const connectDb = require("./config/db");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authUser = require("./middlewares/auth");

const app = express();

//use of middleware for conversion of json into js
app.use(express.json());
app.use(cookieParser());
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
app.get("/feed", authUser, async (req, res) => {
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
    const { firstName, lastName, emailId, password, phoneNum, age } = req.body;
    //encryption of password
    const encryptPass = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: encryptPass,
      phoneNum,
      age,
    });

    await user.save();
    res.send("Data is pushed into db successfully");
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

//user login
app.post("/login", async (req, res) => {
  try {
    const { emailId: email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email");
    }
    const user = await User.findOne({ emailId: email });
    if (!user) {
      throw new Error("Invalid credientials");
    }
    //compare  password sent from the user with the password present in the db
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credientials");
    } else {
      //generate a token using the schema
      const token = await user.getJWT();
      //adding cookie to the token and sending response back to the client
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day in milliseconds
        httpOnly: true, // Recommended: Protects cookie from client-side XSS scripts
      });
      res.send("Login Successfull");
    }
  } catch (err) {
    res.send("Error: " + err.message);
  }
});
//get profile
app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

//upadation of data
app.patch("/user", authUser, async (req, res) => {
  const { user_ID, ...data } = req.body;
  try {
    const updateList = ["age", "skills", "firstName", "gender"];
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
//send connection request
app.post("/request", authUser, async (req, res) => {
  res.send("Connection request sent sucessfully");
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
