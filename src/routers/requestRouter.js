const express = require("express");
const mongoose = require("mongoose"); // FIXED: Required mongoose to use the isValid() utility method
const User = require("../models/user");
const authUser = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");

const requestRouter = express.Router();

//sending connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const isValidStatus = ["interested", "ignored"];

      // 1. FIXED: Ensure the incoming URL parameter string format is a valid MongoDB ObjectId first
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new Error("Invalid User ID format");
      }

      // 2. FIXED: Moved database query down. It is now safe from CastError crashes.
      const isValidtoUserId = await User.findById(toUserId);
      if (!isValidtoUserId) {
        throw new Error("touser is not in the db");
      }

      if (fromUserId.toString() === toUserId.toString()) {
        throw new Error("Cant send request yourself");
      }
      if (!isValidStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      
      const duplicateRequest = await ConnectionRequest.findOne({
        fromUserId,
        toUserId,
      });
      
      if (duplicateRequest) {
        if (duplicateRequest.status == status) {
          throw new Error("Connection request already exist");
        }
        duplicateRequest.status = status;
        const data = await duplicateRequest.save();
        return res.json({
          message: "connection request updated successfully", // Small tweak: "updated" makes logs and front-end clear
          data,
        });
      }

      const connectRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectRequest.save();
      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  },
);

module.exports = requestRouter;
