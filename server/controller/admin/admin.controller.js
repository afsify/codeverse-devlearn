const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../../model/user.model");
const adminModel = require("../../model/admin.model");
const orderModel = require("../../model/order.model");
const courseModel = require("../../model/course.model");
const contactModel = require("../../model/contact.model");
const projectModel = require("../../model/project.model");

//! ============================================== Verify Login ==============================================

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminData = await adminModel.findOne({ email });
    if (adminData) {
      const isMatch = await bcrypt.compare(password, adminData.password);
      if (isMatch) {
        let token = jwt.sign(
          { id: adminData._id, role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: "3d" }
        );
        return res
          .status(200)
          .send({ message: "Signin Success", success: true, token });
      } else {
        return res
          .status(400)
          .send({ message: "Incorrect Password", success: false });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Incorrect Email", success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== Admin Info ===============================================

const getAdmin = async (req, res, next) => {
  try {
    let adminData = await adminModel.findById(req.adminId, {
      password: 0,
    });
    if (adminData) {
      const adminDetail = {
        email: adminData.email,
      };
      return res.status(200).send({
        auth: true,
        success: true,
        result: adminDetail,
        data: adminData,
        message: "Login Success",
      });
    } else {
      return res
        .status(500)
        .send({ auth: false, success: false, message: "Admin Not Found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================= List Dashboard =============================================

const listDashboard = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find()
      .populate({ path: "user", select: "name image" })
      .exec();
    const orderCount = await orderModel.countDocuments();
    const courseCount = await courseModel.countDocuments();
    const contactCount = await contactModel.countDocuments();
    const projectCount = await projectModel.countDocuments();
    const totalMembersCount = await userModel.countDocuments();
    const primeMembersCount = await userModel.countDocuments({ prime: true });
    const normalUsersCount = await userModel.countDocuments({ prime: false });
    const courseProfit = orders.reduce((acc, order) => acc + order.price, 0);
    const primeProfit = primeMembersCount * 399;
    const totalProfit = courseProfit + primeProfit;
    const data = {
      orders,
      orderCount,
      courseCount,
      contactCount,
      projectCount,
      totalMembersCount,
      primeMembersCount,
      normalUsersCount,
      courseProfit,
      primeProfit,
      totalProfit,
    };
    res.status(200).json({
      message: "Dashboard Fetched",
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ================================================ List User ================================================

const listUser = async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({
      message: "Users Fetched",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== Block User ===============================================

const blockUser = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.userId,
      { status: "blocked" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "User Blocked",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Unblock User ==============================================

const unblockUser = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.userId,
      { status: "unblocked" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "User Unblocked",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== List Feedback ==============================================

const listFeedback = async (req, res, next) => {
  try {
    const feedback = await contactModel.find({});
    res.status(200).json({
      message: "Feedback Fetched",
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Update About ==============================================

const updateAbout = async (req, res, next) => {
  try {
    const {
      name,
      email,
      image,
      resume,
      phone,
      address,
      contact,
      education,
      skill,
    } = req.body;
    const adminId = req.params.adminId;
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    admin.name = name;
    admin.email = email;
    admin.phone = phone;
    admin.image = image;
    admin.resume = resume;
    admin.address = address;
    admin.contact = contact;
    admin.education = education;
    admin.skill = skill;
    const updatedAdmin = await admin.save();
    return res.status(200).send({
      success: true,
      data: updatedAdmin,
      message: "Update Success",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  signin,
  getAdmin,
  listDashboard,
  listUser,
  blockUser,
  unblockUser,
  listFeedback,
  updateAbout,
};
