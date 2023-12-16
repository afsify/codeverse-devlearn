const chatModel = require("../../model/chat.model");
const userModel = require("../../model/user.model");

//! ============================================= List User =============================================

const accessChat = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res.sendStatus(400);
  }
  var isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name image email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.userId, userId],
    };
    try {
      const createdChat = await chatModel.create(chatData);
      const FullChat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate("users", "-password");
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error Occurred" });
      next(error);
    }
  }
};

//! ============================================= Create Chat =============================================

const fetchChat = async (req, res, next) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name image email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== User Chat ==============================================

const createGroup = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  const userData = await userModel.findById(req.userId, {
    password: 0,
  });
  users.push(userData);
  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: userData,
    });
    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Find Chat ==============================================

const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName: chatName,
        },
        {
          new: true,
        }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Find Chat ==============================================

const groupRemove = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await chatModel
      .findByIdAndUpdate(
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
    if (!removed) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    res.json(removed);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Find Chat ==============================================

const groupAdd = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const added = await chatModel
      .findByIdAndUpdate(
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
    if (!added) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    res.json(added);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  groupRemove,
  groupAdd,
};
