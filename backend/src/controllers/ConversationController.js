import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/FileUpload.js";
import { Conversation } from "../models/Conversation.js";
import { Participant } from "../models/Participants.js";
import { Message } from "../models/Message.js";

const createConversation = asyncHandler(async (req, res, next) => {
  try {
    const { conversationName, conversationUserName } = req.body;
    const currentUser = req.user;

    if (!conversationName && !conversationUserName) {
      res.status(402).json(new ApiResponse(402, "Fields Required"));
    }
    const existOrNot = await Conversation.findOne({
      $or: [{ conversationUserName }],
    });

    if (existOrNot) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, "Group with this username already exists"),
          existOrNot
        );
    }

    let imageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      imageLocalPath = req.files.image[0].path;
    }
    let image = await uploadOnCloudinary(imageLocalPath);

    const createdGroup = await Conversation.create({
      admin: currentUser._id,
      conversationName,
      conversationUserName: conversationUserName?.replace(/\s+/g, ""),
      isGroupChat: true,
      profileImage: image?.url || "",
    });

    const group = await Conversation.findById(createdGroup._id);

    req.chat = group;
    req.user = currentUser;
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Group ${group.conversationName} created Successfully`
        )
      );
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "An error occurred while creating the conversation",
          error.message
        )
      );
  }
});

const createUserConversation = asyncHandler(async (req, res, next) => {
  try {
    const { userName } = req.body;
    const currentUser = req.user;

    if (!userName) {
      return res.status(401).json(new ApiResponse(401, "Fields Required"));
    }
    const otheruser = await User.findOne({ userName: userName }).select(
      "-password -refreshToken"
    );
    if (!otheruser) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    if (otheruser._id.toString() === currentUser._id.toString()) {
      return res
        .status(400)
        .json(new ApiResponse(400, "You cannot chat with yourself"));
    }
    let createdGroup;
    let conversationuserName = `${currentUser.userName}_${userName}`
    const existOrNot = await Conversation.findOne({
      conversationUserName: conversationuserName,
    });

    if (existOrNot) {
        return res.status(409).json(
          new ApiResponse(409, "Conversation already exists", {
            conversation: existOrNot,
          })
        );
    } 
      const user = await User.findById(currentUser._id);
          createdGroup = await Conversation.create({
            conversationName: otheruser.displayName,
            conversationUserName: conversationuserName,
            isGroupChat: false,
            profileImage: otheruser.avatarUrl || "",
          });

    const group = await Conversation.findById(createdGroup._id);

    req.chat = group;
    req.user = currentUser;
    req.otheruser = otheruser;
    res.status(200).json(
      new ApiResponse(
        200,
        `User ${group.conversationName} created Successfully`,
        {
          conversation: group,
        }
      )
    );

    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "An error occurred while creating user conversation",
          error.message
        )
      );
  }
});

const updateConversation = asyncHandler(async (req, res) => {
  try {
    const { oldGroupUserName } = req.params;
    const { conversationName, conversationUserName, userName } = req.body;
    const currentUser = req.user;

    if (!oldGroupUserName) {
      return res.status(400).json({ error: "Group username is required" });
    }

    const existOrNot = await Conversation.findOne({
      $or: [{ conversationUserName }],
    });

    if (existOrNot) {
      return res
        .status(409)
        .json(new ApiResponse(409, "Group with this username already exists"));
    }
    let user;
    if (userName) {
      user = User.findOne(userName, { new: true }).select(
        "-password -refreshToken"
      );
      if (!user) {
        return res.status(404).json(new ApiResponse(404, "User not found"));
      }
    }

    let imageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      imageLocalPath = req.files.image[0].path;
    }
    let image = await uploadOnCloudinary(imageLocalPath);

    const groupDetails = await Conversation.findOneAndUpdate(
      { conversationUserName: oldGroupUserName },
      {
        $set: {
          conversationName: conversationName || undefined,
          conversationUserName:
            conversationUserName?.replace(/\s+/g, "") || undefined,
          admin: user?._id || undefined,
          profileImage: image?.url || undefined,
        },
      },
      { new: true }
    );

    if (!groupDetails) {
      return res.status(404).json(new ApiResponse(404, "Group not found"));
    }
    await groupDetails.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Group updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "An error occurred while updating the conversation",
          error.message
        )
      );
  }
});

const getAllConversation = asyncHandler(async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized"));
    }

    const participantConversations = await Participant.find({
      participant: currentUser._id,
    }).populate({
      path: "conversation",
      populate: {
        path: "admin",
        select: "userName displayName avatarUrl",
      },
    });

    if (!participantConversations || participantConversations.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No conversations found for the user"));
    }

    const conversations = await Promise.all(
      participantConversations.map(async (participant) => {
        const conversation = participant.conversation.toObject();
        const participants = await Participant.find({
          conversation: conversation._id,
        }).populate("participant", "userName displayName avatarUrl");
        conversation.participants = participants.map((p) => p.participant);
        return conversation;
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Conversations fetched successfully",
          conversations
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "An error occurred while fetching conversations",
          error.message
        )
      );
  }
});

const searchConversation = asyncHandler(async (req, res) => {
  try {
    const { conversationName } = req.body;
    let conversations = [];
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized"));
    }

    if (conversationName && conversationName.replace(/\s+/g, "") !== "") {
      const matchedConversations = await Conversation.find({
        conversationName: { $regex: conversationName, $options: "i" },
        isGroupChat: true,
      }).populate("admin", "userName displayName");

      conversations = await Promise.all(
        matchedConversations.map(async (conversation) => {
          conversations = conversation.toObject();
          const participants = await Participant.find({
            conversation: conversation._id,
          }).populate("participant", "userName displayName avatarUrl");
          conversations.participants = participants.map((p) => p.participant);
          return conversations;
        })
      );
    }

    if (conversations.length === 0) {
      return res.status(404).json(new ApiResponse(404, "No Group found!!"));
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Groups fetched successfully", conversations)
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "An error occurred while fetching conversations",
          error.message
        )
      );
  }
});

const deleteConversation = asyncHandler(async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUser = req.user;

    if (!conversationId) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Conversation ID required"));
    }

    const conversation = await Conversation.findById(conversationId);
    console.log(conversation);
    if (!conversation) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Conversation not found"));
    }

    if (conversation.admin?.toString() !== currentUser._id.toString() && 0) {
      return res.status(403).json(new ApiResponse(403, "Unauthorized action"));
    }

    await Message.deleteMany({ conversation: conversationId });
    await Participant.deleteMany({ conversation: conversationId });
    await Conversation.deleteOne({ _id: conversationId });

    return res
      .status(200)
      .json(new ApiResponse(200, "Conversation deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "An error occurred while deleting the conversation",
          error.message
        )
      );
  }
});
export {
  createConversation,
  updateConversation,
  getAllConversation,
  createUserConversation,
  searchConversation,
  deleteConversation,
};
