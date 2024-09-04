import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
        error: true,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      message: "User registered successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    res.json({
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
        error: true,
      });
    }
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect Password or Email",
        success: false,
        error: true,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Incorrect Password ",
        success: false,
        error: true,
      });
    }

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        expires: new Date(Date.now() + 1000 * 86400),
      })
      .json({
        message: `welcome back to ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    res.json({
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie(
      "token",
      "",
      { expires: 0 }.json({
        message: "Logged out successfully",
        success: true,
        error: false,
      })
    );
  } catch (error) {
    res.json(error, {
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await userModel.findById(userId);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    res.json(error, {
      message: error.message,
      error: true,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      user,
      message: "Profile updated successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    res.json(error, {
      message: error.message || error,
      error: true,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await userModel
      .find({ _id: { $ne: req.id } })
      .select("-password");
    if (!suggestedUsers) {
      return res.status(404).json({
        message: "No users found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      success: true,
      error: false,
      message: "Suggested users fetched successfully",
      users: suggestedUsers,
    });
  } catch (error) {
    res.json(error, {
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const followOrUnfollowUser = async (req, res) => {
  try {
  } catch (error) {
    res.json(error, {
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
