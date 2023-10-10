const express = require("express");
const user_router = express.Router();
const userController = require("../controller/user.controller");
const { userAuth } = require("../middleware/auth");

//? ============================================= Authorization =============================================

user_router.post("/send-otp", userController.sendOtp);
user_router.post("/verify-otp", userController.verifyOtp);
user_router.post("/login", userController.login);
user_router.get("/get-user", userAuth, userController.getUser);

//? ============================================ Forget Password ============================================

user_router.post("/forgot-password", userController.forgotPassword);
user_router.post("/otp-check", userController.otpCheck);
user_router.post("/reset-password", userController.resetPassword);

//? =============================================== Home Page ===============================================

user_router.get("/list-banner", userController.listBanner);
user_router.get("/list-project", userController.listProject);

//? ================================================ Service ================================================

user_router.get("/list-service", userController.listService);

//? ================================================ Course ================================================

user_router.get("/list-course", userController.listCourse);
user_router.post("/create-order", userAuth, userController.createOrder);
user_router.get("/list-order", userAuth, userController.listOrder);

//? ================================================ Contact ================================================

user_router.post("/prime-payment", userAuth, userController.primePayment);

//? ================================================= About =================================================

user_router.get("/get-about", userController.getAbout);

//? ================================================ Profile ================================================

user_router.post("/update-profile", userAuth, userController.updateProfile);

module.exports = user_router;
