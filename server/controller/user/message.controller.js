const chatModel = require("../../model/chat.model");
const userModel = require("../../model/user.model");
const messageModel = require("../../model/message.model");

//! ============================================== Add Message ==============================================

const listMessage = async (req, res, next) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Send Message ==============================================

const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.userId,
    content: content,
    chat: chatId,
  };
  try {
    var message = await messageModel.create(newMessage);
    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name image email",
    });
    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  listMessage,
  sendMessage,
};
