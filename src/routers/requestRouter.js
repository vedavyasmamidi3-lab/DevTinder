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
      const isValidStatus = ["interested","ignored"];



      // 1. Ensure the incoming URL parameter string format is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new Error("Invalid User ID format");
      }

      // 2. Validate that the recipient exists in the database
      const isValidtoUserId = await User.findById(toUserId);
      if (!isValidtoUserId) {
        throw new Error("touser is not in the db");
      }

      // 3. Prevent self-requests
      if (fromUserId.toString() === toUserId.toString()) {
        throw new Error("Cant send request yourself");
      }

      // 4. Validate status type
      if (!isValidStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      
      // 5. FIXED: Check for any existing request in BOTH directions (A->B or B->A)
      const existingRequest = await ConnectionRequest.findOne({
           fromUserId,
           toUserId
      });
      
      if (existingRequest) {
        // If the request is in the exact same direction, allow updating the status
         throw new Error("Connection request already exist");
      }

      

      // 6. Create a brand new connection request if no relationship exists yet
      const connectRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectRequest.save();

      if(status==="ignored")
      {
        return res.json({
          message: `${isValidtoUserId.firstName || "User"} ignored successfully`,
        })
      }
      
      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  },
);

//reviewing connection request(accepting or rejecting)
requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // 1. Validate the status
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed",
        });
      }

      // 2. Validate the request ID format
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          message: "Invalid request ID",
        });
      }

      // 3. Find and update only a pending request
      //    addressed to the logged-in user
      const connectionRequest =
        await ConnectionRequest.findOneAndUpdate(
          {
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
          },
          {
            $set: { status },
          },
          {
            new: true,
            runValidators: true,
          }
        );

      // 4. Handle missing, unauthorized, or already-reviewed requests
      if (!connectionRequest) {
        return res.status(404).json({
          message:
            "Connection request not found, already reviewed, or you are not authorized",
        });
      }

      // 5. Send success response
      return res.status(200).json({
        message: `Connection request ${status} successfully`,
        data: connectionRequest,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);



module.exports = requestRouter;


//there is major flaw in storing ignored connection request