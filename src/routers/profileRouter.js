const User = require("../models/user");
const express = require("express");
const authUser = require("../middlewares/auth");
const validator = require("validator");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

//api to get user by email
profileRouter.get("/user/email", authUser, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    if (!userEmail) {
      throw new Error("Missing emailId query parameter");
    }
    const isValideEmail = validator.isEmail(userEmail);
    if (!isValideEmail) {
      throw new Error("Enter a valid email");
    }
    const user = await User.findOne({ emailId: userEmail }).select(
      "-password -__v",
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Error! " + err.message);
  }
});
//getProfile
profileRouter.get("/profile/view", authUser, (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error!: " + err.message);
  }
});
//upadte profile
profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    // 1. Run your exact validation check
    const isValid = validateEditProfileData(req);
    if (!isValid) {
      throw new Error("Invalid upadation request");
    }

    // 2. Access the logged-in user (assuming auth middleware populates req.user)
    const loggedInUser = req.user;

    // 3. Update the fields using the correct arrow function syntax we fixed earlier
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // 4. Save to database
    await loggedInUser.save();

    res.json("Profile updated successfully!");
  } catch (error) {
    // This will print the exact database schema or validation error to your console

    res.status(500).send("Error! " + error.message);
  }
});
//change password while knowing the current pass
profileRouter.post("/profile/password", authUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;
    const isCorrectPass = await loggedInUser.validatePassword(currentPassword);
    if (!isCorrectPass) {
      throw new Error("Enter correct password");
    }
    const hashedNewPass = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedNewPass;
    await loggedInUser.save();

    res.send("Password updation successful");
  } catch (err) {
    res.status(400).send("Error! " + err.message);
  }
});

module.exports = profileRouter;
