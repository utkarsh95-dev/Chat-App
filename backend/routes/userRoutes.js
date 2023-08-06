import express from "express";
import {
  allUsers,
  authUser,
  registerUser,
} from "../controllers/userControllers.js";
import { problem } from "../middleWares/authMiddleWare.js";

const router = express.Router();

router.route("/").post(registerUser).get(problem, allUsers);
router.post("/login", authUser);
export default router;
