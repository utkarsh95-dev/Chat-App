import asyncHandler from "express-async-handler";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";

export const accessChats = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId params not sent with the request");
    return res.status(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMesssage.sender",
    select: "name picture email",
  });

  if (isChat.length > 0) {
    res.json(isChat[0]);
  } else {
    var chatData = {
      chatName: "New Chat",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        let newResult = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name picture email",
        });
        res.status(200).send(newResult);
      });
  } catch (error) {
    res.status(404).send("chat doesn't exists");
  }
});

export const createGroupChats = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(404).send({ message: "please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "no. of participants cant be less than 2" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const addedMembers = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedMembers) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(addedMembers);
  }
});

export const removeFromGroupGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removedMembers = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedMembers) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removedMembers);
  }
});
