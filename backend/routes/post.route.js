import express from "express";
import IsAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";
import {
  addComment,
  addNewPost,
  bookMarkPost,
  deletePost,
  disLikePost,
  getAllPosts,
  getCommentsByPost,
  getUserPost,
  likePost,
} from "../controller/post.controller.js";

const router = express.Router();

router
  .route("/addpost")
  .post(IsAuthenticated, upload.single("image"), addNewPost);

router.route("/all").get(IsAuthenticated, getAllPosts);

router.route("/userpost/all").get(IsAuthenticated, getUserPost);

router.route("/:id/like").get(IsAuthenticated, likePost);

router.route("/:id/dislike").get(IsAuthenticated, disLikePost);

router.route("/:id/comment").get(IsAuthenticated, addComment);

router.route("/:id/comment/all").get(IsAuthenticated, getCommentsByPost);

router.route("/delete/:id").get(IsAuthenticated, deletePost);

router.route("/:id/bookmark").post(IsAuthenticated, bookMarkPost);

export default router;
