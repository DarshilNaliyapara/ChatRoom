import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/FileUpload.js";
import jwt from "jsonwebtoken";

const generateAccesandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    res.json(new ApiError(500, "Failed to generate tokens"));
  }
};

const registerUser = asyncHandler(async (req, res, _) => {
  const { userName, email, password, displayName } = req.body;

  if (
    [userName, email, password, displayName].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  const existornot = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existornot) {
    return res
      .status(409)
      .json(new ApiResponse(409, "User with this name or email already exist"));
  }

  let avatarLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    userName,
    email,
    password,
    displayName,
    avatarUrl: avatar?.url || "",
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createduser) {
    throw new ApiError(500, "Somethig Went wrong while registring user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User Registered Successfully", createduser));
});

const loginUser = asyncHandler(async (req, res, _) => {
  const { userName, email, password } = req.body;
  if (!userName && !email) {
    throw new ApiError(400, "Username or Email required!");
  }
  const user = await User.findOne({ $or: [{ email }, { userName }] });

  if (!user) {
    return res.status(404).json({
      message: "User Does not exsist",
    });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Incorrect password",
    });
  }

  const { accessToken, refreshToken } = await generateAccesandRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  if (user) {
    res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Login Successfull!!!", {
          accessToken: accessToken,
        })
      );
  }
});

const logoutUser = asyncHandler(async (req, res, _) => {
  const id = req.user._id;

  await User.findByIdAndUpdate(
    id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options)
    .json(
      new ApiResponse(200, {
        message: "Logout Successfull!!!",
      })
    );
});

const updateUser = asyncHandler(async (req, res, _) => {
  try {
    const data = req.body;
    const user = req.user;

    let avatarLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      avatarLocalPath = req.files.avatar[0].path;
    }
    let avatar = await uploadOnCloudinary(avatarLocalPath);

    const updatedFields = {
      userName: data.userName || user.userName,
      displayName: data.displayName || user.displayName,
      avatarUrl: avatar?.url || user.avatarUrl,
    };

    if (data.password) {
      updatedFields.password = data.password;
    }

    Object.assign(user, updatedFields);
    await user.save();
    const updateduser = await User.findById(user._id);

    if (updateduser) {
      res.json(new ApiResponse(200, "User updated successfully!!"));
    }
  } catch (error) {
    res.json(
      new ApiResponse(500, "Error while update User", {
        userUpdateError: error.message,
      })
    );
  }
});

const accessTokenRefresh = asyncHandler(async (req, res, _) => {
  try {
    const clientRefreshToken =
      req.cookies.RefreshToken || req.body.RefreshToken;
    if (!clientRefreshToken) {
      res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    const decodedtoken = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedtoken._id);

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Invalid refresh token!!"));
    }

    if (clientRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, "RefreshToken is expired or used"));
    }

    const options = {
      httponly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccesandRefreshTokens(
      user._id
    );

    res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Accesstoken Refreshed Successfully", {
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Error while Refresh Token", { error: error.message })
      );
  }
});

const getCurrentUser = asyncHandler(async (req, res, _) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Current User Fetched", req.user));
});

const getAllUsers = asyncHandler(async (req, res, _) => {
  const data = req.body;
  let users;
  if (data.userName && data.userName.trim() !== "") {
    users = await User.find({
      userName: { $regex: data.userName, $options: "i" },
    });
  
    if (users.length === 0) {
      return res.status(404).json(new ApiResponse(404, "No User found!!"));
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, "Users fetched successfully", users));
    }
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  accessTokenRefresh,
  getCurrentUser,
  getAllUsers,
};
