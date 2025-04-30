import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    conversationName: {
      type: String,
      required: true,
    },
    conversationUserName: {
      type: String,
      default: function () {
        return this.conversationName.replace(/\s+/g, "").toLowerCase();
      },
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
