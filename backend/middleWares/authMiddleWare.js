import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const problem = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DECODED", decoded);

      req.user = await User.findById(decoded._id).select("-password");
      console.log("USER", req.user);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("authentication failed!!");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, Token Absent");
  }
});
