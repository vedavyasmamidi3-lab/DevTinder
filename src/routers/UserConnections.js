const express = require("express");
const userRouter = express.Router();
const authUser = require("../middlewares/auth");
const User = require("../models/user");
const mongoose = require("mongoose");
const ConnectionRequest = require("../models/connectionRequests");
//to get all pending requests of a user recieved
userRouter.get("/user/Requests", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const UserPendingConnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);
    if (UserPendingConnectionRequests.length === 0) {
      return res.status(200).json({
        message: "You have no pending connection requests",
        data: [],
      });
    }
    res.json({
      message: "Connections fetched Successfully",
      UserPendingConnectionRequests,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//to get all connected requests
userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const ConnectedRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl"]);
    if (ConnectedRequests.length === 0) {
      return res.status(200).json({
        message: "You have no connected people",
        data: [],
      });
    }
    console.log("Number of accepted requests:", ConnectedRequests.length);

    const connections = ConnectedRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });
    const uniqueConnections = [
      ...new Map(
        connections.map((user) => [user._id.toString(), user]),
      ).values(),
    ];

    res.json({
      message: "Fetched Connected people",
      uniqueConnections,
    });
  } catch (err) {
    res.status(400).send("Error");
  }
});

//user feed
userRouter.get("/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserInFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserInFeed.add(req.fromUserId);
      hideUserInFeed.add(req.toUserId);
    });
    const USER_SAFE_DATA = "firstName lastName photoUrl age gender";
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserInFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
