import express from "express";
import dotenv from "dotenv";
import { chats } from "../backend/data/data.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import {
  errorHandler,
  notFound,
} from "./middleWares/errorHandlerMiddleWares.js";

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(errorHandler);
// app.use(notFound);

app.listen(process.env.PORT, () => {
  console.log(`Application Working on port no. ${process.env.PORT}`);
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/chatz");

// app.get("/users/:id", (req, res) => {
//   const date = chats.find((ele) => ele.id === req.params.id);
//   res.json(date);
// });
