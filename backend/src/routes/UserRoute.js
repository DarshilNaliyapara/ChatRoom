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
const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(Auth, logoutUser);
router.route("/update").post(
  Auth,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUser
);
router.route("/refresh-accesstoken").post(accessTokenRefresh);
router.route("/search").post(Auth, getAllUsers);
router.route("/current").get(Auth, getCurrentUser);
export default router;
