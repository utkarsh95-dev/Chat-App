import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { generateToken } from "../data/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    console.log("api-request", req.body);

    if (!name || !email || !password) {
      res.status(404);
      throw new Error("one of the input field was empty");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(404);
      throw new Error("User Already Exists!!");
    }

    console.log("registeration was successful !!");

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      picture: req.body.picture,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        picture: user.picture,
        token: generateToken(user._id),
      });
      console.log(name, email, password, picture);
    } else {
      res.status(400);
      throw new Error("user cant be created");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User Not Registered!");
  }

  // res.status(400).redirect("/");
});

export const allUsers = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const user = await User.find(keywords).find({ _id: { $ne: req.user._id } });
  res.send(user);
});
