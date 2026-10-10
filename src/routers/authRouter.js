const express = require("express");
const {validateSignUp} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator=require("validator");
const authRouter = express.Router();

// Signup Router
authRouter.post("/signup", async (req, res) => {
  try {
    // validation check
    validateSignUp(req); 
    const { firstName, lastName, emailId, password, phoneNum, age } = req.body;

    // encryption of password
    const encryptedPass = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: encryptedPass,
      phoneNum,
      age,
    });

    await user.save();
    res.send("SignUp successful");
  } catch (err) {
    res.status(400).send("Error! " + err.message); 
  }
});

// Login Router
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid email");
    }

    //finding user using email
    const user = await User.findOne({ emailId }); 
    if (!user) {
      throw new Error("User not found");
    }

    // password validation
    const isValidPass = await user.validatePassword(password);
    if (!isValidPass) {
      throw new Error("Enter correct password");
    } else {
      // token generation
      const token = await user.getJWT();

     //creating a cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Recommended for HTTPS
      });

      res.send("Login successful!!");
    }
  } catch (err) {
    res.status(400).send("Error! " + err.message);
  }
});

// Logout Router
authRouter.post("/logout", (req, res) => {
 //deleting the cookie
  res.clearCookie("token");
  res.send("Logout successful");
});

module.exports = authRouter;
