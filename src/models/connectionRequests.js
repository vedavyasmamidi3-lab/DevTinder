const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        
        values: ["ignored", "accepted", "interested", "rejected"],
        
        message: `{VALUE} is incorrect type`,
      },
    },
  },
  { timestamps: true },
);

// indexing
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

//creating db model
const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
