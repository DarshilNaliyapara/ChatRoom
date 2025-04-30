import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/Message.js";
import { Participant } from "../models/Participants.js";

const sendMessage = asyncHandler(async (req, res, _) => {
 try {
   const chat = req.chat;
   const user = req.user;
 
   const { message } = req.body;
   if (!message) {
     res.status(401).json(new ApiResponse(401, "Fields Required"));
   }
 
   const sentMessage = await Message.create({
     message,
     sentBy: user._id,
     conversation: chat._id,
   });
   const finalMessage = await Message.findById(sentMessage._id);
 
   res
     .status(201)
     .json(new ApiResponse(201, "Message sent successfully", finalMessage));
 } catch (error) {
   return res
     .status(500)
     .json(
       new ApiResponse(
         500,
         "An error occurred while sending the message",
         error.message
       )
     );
  
 }
});

const getMessage = asyncHandler(async (req, res, _) => {
  const chat = req.chat;
  const allmessage = await Message.find({ conversation: chat._id }).populate(
    "sentBy",
    "userName displayName avatarUrl"
  );
  const participants = await Participant.find({
    conversation: chat._id,
  }).populate("participant", "userName displayName avatarUrl");

  return res.status(200).json(
    new ApiResponse(200, "all messages", {
      messages: allmessage,
      users: participants,
    })
  );
});
export { sendMessage, getMessage };
