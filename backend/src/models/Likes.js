import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupUserName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupConvesation",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
