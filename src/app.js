//importing from express modules

const express = require("express");
const bcrypt = require("bcrypt");
//importing the connectDb fn from db.js

const connectDb = require("./config/db");
const User = require("./models/user");

const cookieParser = require("cookie-parser");

const authUser = require("./middlewares/auth");

const app = express();

//use of middleware for conversion of json into js
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/authRouter");
const profileRouter = require("./routers/profileRouter");
const requestRouter = require("./routers/requestRouter");
const UserConnectionRouter=require("./routers/UserConnections");

//api calls
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",UserConnectionRouter);
//get all users in feed
// app.get("/feed", authUser, async (req, res) => {
//   try {
//     const user = await User.find({}); //{} gives all the data in the db
//     res.send(user);
//   } catch (err) {
//     res.status(404).send("Server error");
//   }
// });

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
