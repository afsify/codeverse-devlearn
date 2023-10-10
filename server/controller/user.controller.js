const userModel = require("../model/user.model");
const adminModel = require("../model/admin.model");
const bannerModel = require("../model/banner.model");
const projectModel = require("../model/project.model");
const serviceModel = require("../model/service.model");
const courseModel = require("../model/course.model");
const orderModel = require("../model/order.model");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//! =============================================== Transporter ===============================================

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: 465,

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

//! ================================================= Send OTP =================================================

const sendOtp = async (req, res, next) => {
  try {
    console.log(otp);
    req.session.Name = req.body.name;
    req.session.Email = req.body.email;
    req.session.Password = req.body.password;
    Email = req.body.email;
    const user = await userModel.findOne({ email: Email });
    if (!user) {
      var mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: "🔐 Your Account Verification OTP",
        html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="https://res.cloudinary.com/cloudverse/image/upload/v1695133216/CODEVERSE/ziiitlwjccfbp1ffbort.png" alt="Company Logo" width="150" style="display: block; margin: 0 auto;"/>
              <h2 style="color: #333; font-weight: bold; margin-top: 20px;">Account Verification OTP</h2>
              <p style="color: #777;">Welcome to our platform! To activate your account, please use the following One-Time Password (OTP) for account verification:</p>
              <h1 style="background-color: #007bff; color: #fff; font-size: 36px; padding: 10px; border-radius: 5px;">${otp}</h1>
              <p style="color: #777; margin-top: 20px;">This OTP is valid for a single use and will expire shortly. If you did not register for an account with us, please disregard this message.</p>
              <p style="color: #777;">Thank you for choosing us!</p>
            </div>
          </body>
        </html>
      `,
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return console.log(error);
        }
        res
          .status(200)
          .send({ message: "OTP has been sent", success: true, Email });
      });
    } else {
      return res
        .status(200)
        .send({ message: "Email Already Exist", success: false });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! =============================================== Verify OTP ===============================================

const verifyOtp = async (req, res, next) => {
  try {
    console.log(req.body.otp, "keeee");
    console.log(req.session.Name, "keeee");
    const inputOtp = parseInt(req.body.otp);

    if (inputOtp === otp) {
      const password = req.session.Password;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      req.session.Password = hashPassword;
      let newUser = userModel({
        name: req.session.Name,
        email: req.session.Email,
        password: req.session.Password,
      });
      newUser.save();
      res
        .status(200)
        .send({ message: "Registered Successfully", success: true });
    } else if (req.body.exp) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      userModel
        .create({
          name: req.body.name,
          email: req.body.email,
          password: hashPassword,
        })
        .then(async () => {
          let userData = await userModel.findOne({ email: req.body.email });
          let token = jwt.sign(
            { id: userData._id, role: "user" },
            process.env.JWT_SECRET,
            {
              expiresIn: "5d",
            }
          );
          res.status(200).send({
            message: "Registered Successfully",
            success: true,
            token,
          });
        });
    } else {
      res.status(500).send({ message: "Incorrect OTP", success: false });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================== Verify SignIn ==============================================

const login = async (req, res, next) => {
  try {
    console.log("hygygygy");
    const { email, password } = req.body;
    const userData = await userModel.findOne({ email });
    if (!userData) {
      return res
        .status(404)
        .send({ message: "User Not Found", success: false });
    }
    if (userData.status === "blocked") {
      return res
        .status(403)
        .send({ message: "User is Blocked", success: false });
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Incorrect Password", success: false });
    }
    const token = jwt.sign(
      { id: userData._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================ Forgot Password ============================================

const forgotPassword = async (req, res, next) => {
  try {
    console.log(otp, "send");
    req.session.email = req.body.email;
    Email = req.body.email;
    const user = await userModel.findOne({ email: Email });
    if (user) {
      var mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: "🔐 Password Reset OTP",
        html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="https://res.cloudinary.com/cloudverse/image/upload/v1695133216/CODEVERSE/ziiitlwjccfbp1ffbort.png" alt="Company Logo" width="150" style="display: block; margin: 0 auto;"/>
              <h2 style="color: #333; font-weight: bold; margin-top: 20px;">Password Reset OTP</h2>
              <p style="color: #777;">You've requested a password reset for your account. Please use the following One-Time Password (OTP) to reset your password:</p>
              <h1 style="background-color: #007bff; color: #fff; font-size: 36px; padding: 10px; border-radius: 5px;">${otp}</h1>
              <p style="color: #777; margin-top: 20px;">This OTP is valid for a single use and will expire shortly. If you did not request a password reset, please disregard this message.</p>
              <p style="color: #777;">Thank you for using our services!</p>
            </div>
          </body>
        </html>
      `,
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return console.log(error);
        }
        res
          .status(200)
          .send({ message: "OTP has been sent", success: true, Email });
      });
    } else {
      return res
        .status(200)
        .send({ message: "Email Not Exist", success: false });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! =============================================== OTP Check ===============================================

const otpCheck = async (req, res, next) => {
  try {
    console.log(otp);
    if (req.body.otp == otp) {
      req.session.success = true;
      res.status(200).send({
        message: "OTP Matched",
        success: true,
        Email: req.session.email,
      });
    } else {
      return res.status(400).send({ message: "Incorrect OTP", success: false });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================= Reset Password =============================================

const resetPassword = async (req, res, next) => {
  try {
    if (req.session.success && req.body.email === req.session.email) {
      const user = await userModel.findOne({ email: req.session.email });
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      user.password = hashPassword;
      await user.save();

      res.status(200).send({ message: "Password Updated", success: true });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! =============================================== User Info ===============================================

const getUser = async (req, res, next) => {
  try {
    const userData = await userModel.findById(req.userId, {
      _id: 0,
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
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
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
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
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
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
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
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================== List Course ==============================================

const listCourse = async (req, res, next) => {
  try {
    const courses = await courseModel.find();
    res.status(200).send({
      message: "Courses Fetched Successfully",
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================== Order Course ==============================================

const createOrder = async (req, res, next) => {
  try {
    const { course } = req.body;

    // const charge = await stripe.charges.create({
    //   amount: price * 100,
    //   currency: "INR",
    //   source: token.id,
    //   // description: "Course purchase",
    // });

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
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
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
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================== Prime Payment ==============================================

const primePayment = async (req, res, next) => {
  try {
    // const charge = await stripe.charges.create({
    //   amount: price * 100,
    //   currency: "INR",
    //   source: token.id,
    //   // description: "Course purchase",
    // });

    const user = await userModel.findById(req.userId);

    if (user) {
      user.prime = true;
      await user.save();
    }

    res.status(200).send({
      message: "Payment Success",
      success: true,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
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
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================= Update Profile =============================================

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, place, image } = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    user.name = name;
    user.phone = phone;
    user.place = place;
    user.image = image;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  login,
  forgotPassword,
  otpCheck,
  resetPassword,
  getUser,
  listBanner,
  listProject,
  listService,
  listCourse,
  createOrder,
  listOrder,
  primePayment,
  getAbout,
  updateProfile,
};
