import { userAxiosInstance } from "../axios";

//? ============================================= Authorization =============================================

export const userLogin = (values) => {
  return userAxiosInstance.post("/login", values);
};

export const sendOTP = (values) => {
  return userAxiosInstance.post("/send-otp", values);
};

export const verifyOTP = (values) => {
  return userAxiosInstance.post("/verify-otp", values);
};

export const getUser = () => {
  return userAxiosInstance.get("/get-user");
};

//? ============================================ Forget Password ============================================

export const forgotPassword = (values) => {
  return userAxiosInstance.post("/forgot-password", values);
};

export const checkOTP = (values) => {
  return userAxiosInstance.post("/check-otp", values);
};

export const resetPassword = (values) => {
  return userAxiosInstance.post("/reset-password", values);
};

//? =============================================== Home Page ===============================================

export const listBanner = () => {
  return userAxiosInstance.get("/list-banner");
};

export const topCourse = () => {
  return userAxiosInstance.get("/top-course");
};

export const listProject = () => {
  return userAxiosInstance.get("/list-project");
};

//? ================================================ Service ================================================

export const listService = () => {
  return userAxiosInstance.get("/list-service");
};

export const createDev = (values) => {
  return userAxiosInstance.post("/create-dev", values);
};

export const listDev = () => {
  return userAxiosInstance.get("/list-dev");
};

export const discoverDev = () => {
  return userAxiosInstance.get("/discover-dev");
};

//? ================================================ Course ================================================

export const listCourse = () => {
  return userAxiosInstance.get("/list-course");
};

export const getCourse = (courseId) => {
  return userAxiosInstance.get(`/list-course/${courseId}`);
};

export const createOrder = (values) => {
  return userAxiosInstance.post("/create-order", values);
};

export const listOrder = () => {
  return userAxiosInstance.get("/list-order");
};

//? ================================================ Contact ================================================

export const primePayment = (values) => {
  return userAxiosInstance.post("/prime-payment", values);
};
export const contactMessage = (values) => {
  return userAxiosInstance.post("/contact-message", values);
};

//? ================================================= About =================================================

export const getAbout = () => {
  return userAxiosInstance.get("/get-about");
};

//? ================================================ Profile ================================================

export const updateProfile = (values) => {
  return userAxiosInstance.post("/update-profile", values);
};

export const findUser = (searchTerm) => {
  return userAxiosInstance.get(`/find-user?search=${searchTerm}`);
};

//? ================================================= Chat =================================================

export const accessChat = (values) => {
  return userAxiosInstance.post("/access-chat", values);
};

export const fetchChat = () => {
  return userAxiosInstance.get("/fetch-chat");
};

export const createGroup = (values) => {
  return userAxiosInstance.post("/create-group", values);
};

export const editGroup = (chatId, values) => {
  return userAxiosInstance.post(`/edit-group/${chatId}`, values);
};

export const groupRemove = (values) => {
  return userAxiosInstance.put("/group-remove", values);
};

export const groupAdd = (values) => {
  return userAxiosInstance.put("/group-add", values);
};

//? ================================================ Message ================================================

export const listMessage = (chatId) => {
  return userAxiosInstance.get(`/list-message/${chatId}`);
};

export const sendMessage = (values) => {
  return userAxiosInstance.post("/send-message", values);
};
