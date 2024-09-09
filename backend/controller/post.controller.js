import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { Comment } from "../model/comment.model.js";

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

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id; // get the authorId from the request object
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "post not found", error: true });
    //checking the post author is same as the author or not
    if (post.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post", error: true });
    }
    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's posts array
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId); // filter the post id from the user's posts array

    await user.save(); // save the user document with the updated posts array

    // delete all the comments associated with the post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    res.json(error, {
      message: "Error deleting post",
      error: true,
    });
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

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture", // populate the author field of each post
      })
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
    res.json(error, {
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const userLikedPost = req.id;
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    await post.updateOne({ $addToSet: { likes: userLikedPost } });
    await post.save();
    // implement socket.io for real time updates and notifications
    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
      post,
    });
  } catch (error) {
    res.json(error, {
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const disLikePost = async (req, res) => {
  try {
    const userLikedPost = req.id;
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    await post.updateOne({ $pull: { likes: userLikedPost } });
    await post.save();
    // implement socket.io for real time updates and notifications
    return res.status(200).json({
      message: "Post dis-liked successfully",
      success: true,
      post,
    });
  } catch (error) {
    res.json(error, {
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userComments = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(404)
        .json({ message: "text is required", success: false });
    const comment = await Comment.create({
      text,
      author: userComments,
      post: postId,
    }).populate({
      path: "author",
      select: "username, profilePicture", // populate the author field of each comment with the username and profilePicture fields
    });
    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
      comment,
    });
  } catch (error) {
    res.json(error, {
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.findById({ post: postId }).populate(
      "author",
      "username, profilePicture" // populate the author field of each comment with the username and profilePicture fields
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found", success: false, error: true });

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      comments,
    });
  } catch (error) {
    res.json(error, {
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};

export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false, error: true });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // update the save and remove bookmark in the bookmarks
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "unsaved", message: "post removed", success: true });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "saved",
          message: "post saved in bookmarks",
          success: true,
        });
    }
  } catch (error) {
    res.json(error, {
      message: error.message || "Error",
      success: false,
      error: true,
    });
  }
};
