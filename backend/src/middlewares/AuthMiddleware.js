import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const Auth = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer", "").trim();
    if (!token) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized Request!!"));
    }
    const decodedtoekn = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedtoekn?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiResponse(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiResponse(401, error?.message || "invalid Accesstoken");
  }
});
