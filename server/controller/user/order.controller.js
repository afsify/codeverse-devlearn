const userModel = require("../../model/user.model");
const chatModel = require("../../model/chat.model");
const orderModel = require("../../model/order.model");

//! ============================================== Order Course ==============================================

const createOrder = async (req, res, next) => {
  try {
    const { course } = req.body;
    const order = new orderModel({
      user: req.userId,
      courseId: course._id,
      image: course.image,
      title: course.title,
      description: course.description,
      price: course.price,
      videos: course.videos,
    });
    await order.save();
    res.status(200).send({
      message: "Payment Success",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== List Order ==============================================

const listOrder = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ user: req.userId });
    res.status(200).send({
      message: "Orders Fetched Successfully",
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Prime Payment ==============================================

const primePayment = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    const { subscription } = req.body;
    if (user) {
      const endDate = new Date();
      if (subscription === "monthly") {
        endDate.setDate(endDate.getDate() + 31);
      } else if (subscription === "yearly") {
        endDate.setDate(endDate.getDate() + 365);
      }
      user.subscription = subscription;
      user.startDate = new Date();
      user.endDate = endDate;
      user.prime = true;
      await user.save();
      const groupId = process.env.PRIME_GROUP;
      const group = await chatModel.findById(groupId);
      if (group && !group.users.includes(user._id)) {
        group.users.push(user._id);
        await group.save();
      }
    }
    res.status(200).send({
      message: "Payment Success",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  createOrder,
  listOrder,
  primePayment,
};
