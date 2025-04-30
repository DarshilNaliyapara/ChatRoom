import { Router } from "express";
import { upload } from "../middlewares/MulterMiddleware.js";
import { Auth } from "../middlewares/AuthMiddleware.js";
import { ConversationDetails } from "../middlewares/ConversationMiddleware.js";
import { getMessage, sendMessage } from "../controllers/MessageController.js";
import { addparticipant } from "../middlewares/AddParticipants.js";

const router = Router();
router
  .route("/:username")
  .post(Auth, ConversationDetails, addparticipant, sendMessage);
router.route("/:username/messages").get(Auth, ConversationDetails, getMessage);
export default router;
