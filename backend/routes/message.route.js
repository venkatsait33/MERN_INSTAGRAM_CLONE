import express from "express";
import IsAuthenticated from "../middleware/isAuthenticated.js";
import { getMessage, sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(IsAuthenticated, sendMessage);

router.route("/all/:id").get(IsAuthenticated, getMessage);

export default router;
