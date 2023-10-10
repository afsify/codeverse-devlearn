import { userAxiosInstance } from "../axios";

//? ============================================= Authorization =============================================

export const userLogin = (values) => {
  return userAxiosInstance.post("/login", values);
};

export const sendOtp = (values) => {
  return userAxiosInstance.post("/send-otp", values);
};

export const verifyOtp = (values) => {
  return userAxiosInstance.post("/verify-otp", values);
};

export const getUser = () => {
  return userAxiosInstance.get("/get-user");
};

//? ============================================ Forget Password ============================================

export const forgotPassword = (values) => {
  return userAxiosInstance.post("/forgot-password", values);
};

export const otpCheck = (values) => {
  return userAxiosInstance.post("/otp-check", values);
};

export const resetPassword = (values) => {
  return userAxiosInstance.post("/reset-password", values);
};

//? =============================================== Home Page ===============================================

export const listBanner = () => {
  return userAxiosInstance.get("/list-banner");
};

export const listProject = () => {
  return userAxiosInstance.get("/list-project");
};

//? ================================================ Service ================================================

export const listService = () => {
  return userAxiosInstance.get("/list-service");
};

export const getService = (serviceId) => {
  return userAxiosInstance.get(`/get-service/${serviceId}`);
};

//? ================================================ Course ================================================

export const listCourse = () => {
  return userAxiosInstance.get("/list-course");
};

export const createOrder = (values) => {
  return userAxiosInstance.post("/create-order",values);
};

export const listOrder = () => {
  return userAxiosInstance.get("/list-order");
};

//? ================================================ Contact ================================================

export const primePayment = (values) => {
  return userAxiosInstance.post("/prime-payment", values);
};

//? ================================================= About =================================================

export const getAbout = () => {
  return userAxiosInstance.get("/get-about");
};

//? ================================================ Profile ================================================

export const updateProfile = (values) => {
  return userAxiosInstance.post("/update-profile", values);
};
