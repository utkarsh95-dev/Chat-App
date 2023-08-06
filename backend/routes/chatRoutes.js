import express from "express";
import {
  accessChats,
  addToGroup,
  createGroupChats,
  fetchChats,
  removeFromGroupGroup,
  renameGroup,
} from "../controllers/chatControllers.js";
import { problem } from "../middleWares/authMiddleWare.js";

const router = express.Router();

router.route("/").post(problem, accessChats);
router.route("/").get(problem, fetchChats);
router.route("/group").post(problem, createGroupChats);
router.route("/rename").put(problem, renameGroup);
router.route("/groupremove").put(problem, removeFromGroupGroup);
router.route("/groupadd").put(problem, addToGroup);

export default router;
