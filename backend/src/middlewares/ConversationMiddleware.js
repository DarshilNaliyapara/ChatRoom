import { Conversation } from "../models/Conversation.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ConversationDetails = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "username is required" });
    }
    const chat = await Conversation.findOne({ conversationUserName: username });
    if (!chat) {
      return res.status(404).json(new ApiResponse(404, "No Group Found!!"));
    }
    req.chat = chat;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiResponse(401, error?.message || "invalid username");
  }
});
