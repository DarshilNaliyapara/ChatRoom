import { Participant } from "../models/Participants.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addparticipant = asyncHandler(async (req, _, next) => {
  const chat = req.chat;
  const currentUser = req.user;
  const other = req.otheruser;

  const participantExists = await Participant.exists({
    participant: currentUser._id,
    conversation: chat._id,
  });
  if (!participantExists) {
    await Participant.create({
      participant: currentUser._id,
      conversation: chat._id,
    });
  }
  const otherUser = await User.findOne({
    userName: other?.userName,
  });
  if (
    otherUser &&
    !(await Participant.exists({
      $and: [{ participant: otherUser._id }, { conversation: chat._id }],
    }))
  ) {
    await Participant.create({
      participant: otherUser._id,
      conversation: chat._id,
    });
  }

  req.chat = chat;
  req.user = currentUser;
  next();
});
