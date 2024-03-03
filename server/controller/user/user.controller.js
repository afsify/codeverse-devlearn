const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userModel = require("../../model/user.model");
const adminModel = require("../../model/admin.model");
const orderModel = require("../../model/order.model");
const bannerModel = require("../../model/banner.model");
const courseModel = require("../../model/course.model");
const projectModel = require("../../model/project.model");
const serviceModel = require("../../model/service.model");
const contactModel = require("../../model/contact.model");

//! =============================================== Transporter ===============================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
let otp;
function generateSixDigitOTP() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//! ================================================= Send OTP =================================================

const sendOTP = async (req, res, next) => {
  try {
    otp = generateSixDigitOTP();
    console.log(otp);
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      var mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: "🔐 Your Account Verification OTP",
        html: `
        <html><body style="font-family: Arial, sans-serif; background-color: #f7f7f7; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;"><img src=
        "https://res.cloudinary.com/cloudverse/image/upload/v1695133216/CODEVERSE/logo.png"
        alt="Company Logo" width="150" style="display: block; margin: 0 auto;"/><h2 style="color: #333;
        font-weight: bold; margin-top: 20px;">Account Verification OTP</h2><p style="color: #777;">Welcome
        to our platform! To activate your account, please use the following One-Time Password (OTP) for
        account verification:</p><h1 style="background-color: #007bff; color: #fff; font-size: 36px;
        padding: 10px; border-radius: 5px;">${otp}</h1><p style="color: #777; margin-top: 20px;">This OTP
        is valid for a single use and will expire shortly.If you did not register for an account with us,
        please disregard this message.</p><p style="color: #777;">Thank you for choosing us!</p></div>
        </body></html>
      `,
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          res
            .status(500)
            .send({ message: "Email sending failed", success: false });
        }
        const user = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        };
        res.status(200).send({
          message: "OTP has been sent",
          success: true,
          user,
        });
      });
    } else {
      res.status(200).send({ message: "Email Already Exists", success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== Verify OTP ===============================================

const verifyOTP = async (req, res, next) => {
  try {
    const inputOtp = parseInt(req.body.otp);
    if (inputOtp === otp) {
      const { name, email, password } = req.body.user;
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = userModel({
        name: name,
        email: email,
        password: hashPassword,
      });
      await newUser.save();
      return res
        .status(200)
        .send({ message: "Registration Success", success: true });
    } else {
      return res.status(400).send({ message: "Incorrect OTP", success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Verify SignIn ==============================================

const login = async (req, res, next) => {
  try {
    const { name, email, password, exp, image } = req.body;
    const userData = await userModel.findOne({ email });
    if (exp && userData === null) {
      const hashPassword = await bcrypt.hash(password, 10);
      userModel
        .create({
          name: name,
          email: email,
          password: hashPassword,
          image: image ? image : undefined,
        })
        .then(async () => {
          let userData = await userModel.findOne({ email: email });
          let token = jwt.sign(
            { id: userData._id, role: "user" },
            process.env.JWT_SECRET,
            {
              expiresIn: "3d",
            }
          );
          res.status(200).send({
            message: "Registration Success",
            success: true,
            token,
          });
        });
    } else if (!userData) {
      return res
        .status(404)
        .send({ message: "User Not Found", success: false });
    } else if (userData.status === "blocked") {
      return res
        .status(403)
        .send({ message: "User is Blocked", success: false });
    } else {
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return res
          .status(401)
          .send({ message: "Incorrect Password", success: false });
      }
      const token = jwt.sign(
        { id: userData._id, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      res.status(200).send({ message: "Login Success", success: true, token });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================ Forgot Password ============================================

const forgotPassword = async (req, res, next) => {
  try {
    otp = generateSixDigitOTP();
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      var mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: "🔐 Password Reset OTP",
        html: `
        <html><body style="font-family: Arial, sans-serif; background-color: #f7f7f7; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;"><img src=
        "https://res.cloudinary.com/cloudverse/image/upload/v1695133216/CODEVERSE/logo.png"
        alt="Company Logo" width="150" style="display: block; margin: 0 auto;"/><h2 style="color: #333;
        font-weight: bold; margin-top: 20px;">Password Reset OTP</h2><p style="color: #777;">You've requested
        a password reset for your account. Please use the following One-Time Password (OTP) to reset your
        password:</p><h1 style="background-color: #007bff; color: #fff; font-size: 36px; padding: 10px;
        border-radius: 5px;">${otp}</h1><p style="color: #777; margin-top: 20px;">This OTP is valid for a
        single use and will expire shortly. If you did not request a password reset, please disregard this
        message.</p><p style="color: #777;">Thank you for using our services!</p></div></body></html>
      `,
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          res
            .status(500)
            .send({ message: "Email sending failed", success: false });
        }
        res.status(200).send({
          message: "OTP has been sent",
          success: true,
          email: req.body.email,
        });
      });
    } else {
      return res
        .status(200)
        .send({ message: "Email Not Exist", success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== OTP Check ===============================================

const checkOTP = async (req, res, next) => {
  try {
    const inputOtp = parseInt(req.body.otp);
    if (inputOtp === otp) {
      res.status(200).send({
        message: "OTP Matched",
        success: true,
        email: req.body.email,
      });
    } else {
      return res.status(400).send({ message: "Incorrect OTP", success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================= Reset Password =============================================

const resetPassword = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    const { password } = req.body.data;
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    res.status(200).send({ message: "Password Updated", success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== User Info ===============================================

const getUser = async (req, res, next) => {
  try {
    const userData = await userModel.findById(req.userId, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (userData) {
      res.status(200).send({
        auth: true,
        userData,
        status: true,
      });
    } else {
      res
        .status(401)
        .json({ auth: false, success: false, message: "Session Expired" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== List Banner ===============================================

const listBanner = async (req, res, next) => {
  try {
    const banner = await bannerModel.find({ status: true });
    res.status(200).send({
      message: "Banners Fetched Successfully",
      success: true,
      data: banner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== Top Course ===============================================

const topCourse = async (req, res, next) => {
  try {
    const coursePurchases = await orderModel.aggregate([
      {
        $group: {
          _id: "$courseId",
          totalPurchases: { $sum: 1 },
        },
      },
      { $sort: { totalPurchases: -1 } },
      { $limit: 4 },
    ]);
    const topCourseIds = coursePurchases.map((item) => item._id);
    const topCourses = await courseModel.find({
      _id: { $in: topCourseIds },
      status: true,
    });
    res.status(200).send({
      message: "Top Courses Fetched Successfully",
      success: true,
      data: topCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== List Project ===============================================

const listProject = async (req, res, next) => {
  try {
    const project = await projectModel.find({ status: true });
    res.status(200).send({
      message: "Projects Fetched Successfully",
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== List Service ==============================================

const listService = async (req, res, next) => {
  try {
    const services = await serviceModel.find({ status: true });
    res.status(200).send({
      message: "Services Fetched Successfully",
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== List Course ==============================================

const listCourse = async (req, res, next) => {
  try {
    const courses = await courseModel.find({ status: true });
    res.status(200).send({
      message: "Courses Fetched Successfully",
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Get Course ==============================================

const getCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const videos = course.videos || [];
    res.status(200).json({
      success: true,
      message: "Course Fetched Successfully",
      data: {
        ...course.toObject(),
        count: videos.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================= Contact Message =============================================

const contactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = contactModel({
      name: name,
      email: email,
      message: message,
    });
    await newMessage.save();
    res.status(200).send({
      message: "Message has been sent",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== View About ===============================================

const getAbout = async (req, res, next) => {
  try {
    const admin = await adminModel.findOne().select("-_id -password").limit(1);
    if (!admin) {
      return res
        .status(200)
        .send({ message: "Admin not Found", success: false });
    } else {
      return res.status(200).send({
        success: true,
        data: admin,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  login,
  forgotPassword,
  checkOTP,
  resetPassword,
  getUser,
  listBanner,
  topCourse,
  listProject,
  listService,
  listCourse,
  getCourse,
  contactMessage,
  getAbout,
};
