import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Image } from "cloudinary-react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Upload } from "antd";
import { cloudUpload } from "../../api/cloudinary";
import { CameraOutlined } from "@ant-design/icons";
import imageLinks from "../../assets/images/imageLinks";
import UserLayout from "../../components/layout/UserLayout";
import { updateProfile } from "../../api/services/userService";
import { hideLoading, showLoading } from "../../utils/alertSlice";

function Profile() {
  const dispatch = useDispatch();
  const encodedUserData = localStorage.getItem("userData");
  const userData = encodedUserData ? JSON.parse(atob(encodedUserData)) : null;
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [place, setPlace] = useState(userData?.place || "");
  const [image, setImage] = useState(userData?.image || imageLinks.profile);

  const onFinish = async () => {
    try {
      const updatedData = {
        image,
        name,
        phone,
        place,
      };
      dispatch(showLoading());
      const response = await updateProfile(updatedData);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error Updating Profile:", error);
      toast.error("Something went wrong");
    }
  };

  const customRequest = async (options) => {
    try {
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      setUploading(true);
      const response = await cloudUpload(formData);
      const cloudinaryImageUrl = response.data.secure_url;
      setImage(cloudinaryImageUrl);
      setUploading(false);
    } catch (error) {
      console.log("Error Uploading Image", error);
      setUploading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const validateName = (rule) => {
    if (!name) {
      return Promise.reject("Please enter your name");
    }
    return Promise.resolve();
  };

  return (
    <UserLayout>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-4 text-center uppercase">
            Profile
          </h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="w-40 h-40 mx-auto mb-6 relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-full w-40 h-40 mx-auto shadow-lg shadow-black"
            >
              {uploading ? (
                <div className="w-full h-full bg-gray-300 flex justify-center items-center">
                  <div className="relative h-24 w-24">
                    <div className="rounded-full h-24 w-24 border-t-4 border-t-blue-500 animate-spin absolute"></div>
                    <div className="h-full w-full flex justify-center items-center">
                      <h1 className="text-blue-500 text-3xl font-mono font-extrabold">
                        &lt;/&gt;
                      </h1>
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  className="object-cover"
                  cloudName={import.meta.env.VITE_CLOUD_NAME}
                  publicId={image}
                  width="auto"
                  height="150"
                  crop="scale"
                  alt="Profile"
                />
              )}
            </motion.div>
            <Upload
              customRequest={customRequest}
              accept="image/*"
              showUploadList={false}
            >
              <Button className="flex items-center justify-center text-base p-2 rounded-full absolute bottom-2 right-2">
                <CameraOutlined />
              </Button>
            </Upload>
          </motion.div>
          <Input
            value={userData?.email}
            placeholder="Email"
            className="p-2 mb-8"
            disabled
          />
          <Form className="flex flex-col gap-2" onFinish={onFinish}>
            <Form.Item
              name="name"
              rules={[
                {
                  pattern: /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
                  message: "Please enter your name",
                },
                {
                  validator: validateName,
                },
              ]}
            >
              <motion.label
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                />
                <motion.span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
                  Name
                </motion.span>
              </motion.label>
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                {
                  pattern: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              ]}
            >
              <motion.label
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
              >
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                />
                <motion.span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
                  Phone
                </motion.span>
              </motion.label>
            </Form.Item>
            <Form.Item
              name="place"
              rules={[
                {
                  pattern: /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
                  message: "Please enter your place",
                },
              ]}
            >
              <motion.label
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
              >
                <Input
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Place"
                  className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                />
                <motion.span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
                  Place
                </motion.span>
              </motion.label>
            </Form.Item>
            <Button
              size="large"
              className="text-white font-semibold hover:scale-105 duration-300"
              htmlType="submit"
            >
              Update
            </Button>
          </Form>
        </motion.div>
      </motion.section>
    </UserLayout>
  );
}

export default Profile;
