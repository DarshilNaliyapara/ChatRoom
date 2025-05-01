import { Router } from "express";
import {
  accessTokenRefresh,
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/UserController.js";
import { upload } from "../middlewares/MulterMiddleware.js";
import { Auth } from "../middlewares/AuthMiddleware.js";
import {
  createConversation,
  createUserConversation,
  deleteConversation,
  getAllConversation,
  searchConversation,
  updateConversation,
} from "../controllers/ConversationController.js";
import { addparticipant } from "../middlewares/AddParticipants.js";

const router = Router();

router.route("/create").post(
  Auth,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createConversation,
  addparticipant
);
router.route("/:oldgroupUserName/update").post(
  Auth,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updateConversation
);
router.route("/").get(Auth, getAllConversation);
router.route("/search").post(Auth, searchConversation);
router.route("/:conversationId/delete").post(Auth, deleteConversation);
router.route("/user/create").post(Auth, createUserConversation, addparticipant);
export default router;
