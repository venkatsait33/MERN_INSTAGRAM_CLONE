import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ref: "User" is the name of the model that we want to reference
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Post = mongoose.model("Post", postSchema);
