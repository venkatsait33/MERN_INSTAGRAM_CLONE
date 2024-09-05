import sharp from "sharp";
import cloudinary from "../utils/cloudinary";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const optimizedImage = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    // we save the post information the userModel in the post with postId
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save(); // save the user document with the new post id
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error.message || error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({
        createdAt: -1,
      })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" }, // populate the author field of each comment
      });

      return res.status(200).json({
        message: "Posts fetched successfully",
        success: true,
        posts,
      });
  } catch (error) {
    console.log(error.message || error);
  }
};
