import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
dotenv.config({});

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));

//API ROUTES
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

const PORT = 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
