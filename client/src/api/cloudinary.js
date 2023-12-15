import axios from "axios";

export const cloudUpload = (formData) => {
  return axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
    formData
  );
};

export const cloudVideoUpload = (formData) => {
  return axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/video/upload`,
    formData
  );
};
