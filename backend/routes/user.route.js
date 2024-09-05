import express from "express";
import {
  editProfile,
  followOrUnfollowUser,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controller/user.controller.js";
import IsAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(IsAuthenticated, getProfile);

router
  .route("/profile/edit")
  .post(IsAuthenticated, upload.single("profilePicture"), editProfile);

router.route("/suggested").get(IsAuthenticated, getSuggestedUsers);
router
  .route("/followorunfollow/:id")
  .post(IsAuthenticated, followOrUnfollowUser);

export default router;
