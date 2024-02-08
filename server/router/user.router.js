const express = require("express");
const user_router = express.Router();
const { userAuth } = require("../middleware/auth");
const userController = require("../controller/user/user.controller");
const chatController = require("../controller/user/chat.controller");
const orderController = require("../controller/user/order.controller");
const devhubController = require("../controller/user/devhub.controller");
const accountController = require("../controller/user/account.controller");
const messageController = require("../controller/user/message.controller");

//? ============================================= Authorization =============================================

user_router.post("/send-otp", userController.sendOTP);
user_router.post("/verify-otp", userController.verifyOTP);
user_router.post("/login", userController.login);
user_router.get("/get-user", userAuth, userController.getUser);

//? ============================================ Forgot Password ============================================

user_router.post("/forgot-password", userController.forgotPassword);
user_router.post("/check-otp", userController.checkOTP);
user_router.post("/reset-password", userController.resetPassword);

//? =============================================== Home Page ===============================================

user_router.get("/list-banner", userController.listBanner);
user_router.get("/top-course", userController.topCourse);
user_router.get("/list-project", userController.listProject);

//? ================================================ Service ================================================

user_router.get("/list-service", userController.listService);

//? ================================================ DevHub ================================================

user_router.post("/create-dev", userAuth, devhubController.createDev);
user_router.get("/list-dev", userAuth, devhubController.listDev);
user_router.get("/discover-dev", devhubController.discoverDev);

//? ================================================ Course ================================================

user_router.get("/list-course", userController.listCourse);
user_router.get("/list-course/:courseId", userController.getCourse);

//? ================================================ Contact ================================================

user_router.post("/contact-message", userController.contactMessage);

//? ================================================= About =================================================

user_router.get("/get-about", userController.getAbout);

//? ================================================ Order ================================================

user_router.post("/create-order", userAuth, orderController.createOrder);
user_router.get("/list-order", userAuth, orderController.listOrder);
user_router.post("/prime-payment", userAuth, orderController.primePayment);

//? ================================================ Profile ================================================

user_router.post("/update-profile", userAuth, accountController.updateProfile);
user_router.get("/find-user", userAuth, accountController.findUser);

//? ================================================= Chat =================================================

user_router.post("/access-chat", userAuth, chatController.accessChat);
user_router.get("/fetch-chat", userAuth, chatController.fetchChat);
user_router.post("/create-group", userAuth, chatController.createGroup);
user_router.put("/rename-group", userAuth, chatController.renameGroup);
user_router.put("/group-remove", userAuth, chatController.groupRemove);
user_router.put("/group-add", userAuth, chatController.groupAdd);

//? ================================================ Message ================================================

user_router.get("/list-message/:chatId", userAuth, messageController.listMessage);
user_router.post("/send-message", userAuth, messageController.sendMessage);

module.exports = user_router;
