import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Image } from "cloudinary-react";
import { useDispatch } from "react-redux";
import { cloudUpload } from "../../api/cloudinary";
import { CameraOutlined } from "@ant-design/icons";
import imageLinks from "../../assets/images/imageLinks";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Form, Input, Button, Upload, Card } from "antd";
import UserLayout from "../../components/layout/UserLayout";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { updateProfile } from "../../api/services/userService";

function Profile() {
  const dispatch = useDispatch();
  const encodedUserData = localStorage.getItem("userData");
  const decoded = encodedUserData ? JSON.parse(atob(encodedUserData)) : null;
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(decoded);
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
        setUserData(response.data.userData);
        const encodedUserData = btoa(JSON.stringify(response.data.userData));
        localStorage.setItem("userData", encodedUserData);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log("Error Updating Profile:", error);
      toast.error("Something went wrong");
    }
  };

  const customRequest = async (options) => {
    try {
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("upload_preset", import.meta.env.VITE_PROFILE_PRESET);
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

  // eslint-disable-next-line no-unused-vars
  const validatePhone = (rule) => {
    if (!phone) {
      return Promise.reject("Please enter your number");
    }
    return Promise.resolve();
  };

  // eslint-disable-next-line no-unused-vars
  const validatePlace = (rule) => {
    if (!place) {
      return Promise.reject("Please enter your place");
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
        <Card
          title={<h1 className="text-3xl font-semibold">Profile</h1>}
          className="w-full mx-auto p-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full p-4 flex flex-col justify-center items-center">
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
                  <Button className="flex items-center text-white justify-center text-base p-2 rounded-full absolute bottom-2 right-2">
                    <CameraOutlined />
                  </Button>
                </Upload>
              </motion.div>
              <h2 className="mt-4 font-bold text-3xl">
                <span>
                  {userData?.name}
                  {userData?.developer ? (
                    <TokenRoundedIcon
                      className="ml-1 mb-2"
                      sx={{ fontSize: 24, color: "green" }}
                    />
                  ) : userData?.prime ? (
                    <VerifiedIcon
                      className="ml-1 mb-2"
                      color="primary"
                      sx={{ fontSize: 24 }}
                    />
                  ) : (
                    ""
                  )}
                </span>
              </h2>
              <p className="text-lg text-gray-300">{userData?.email}</p>
            </div>
            <div className="mt-4">
              <label className="text-md font-medium">Email</label>
              <Input
                size="large"
                value={userData?.email}
                placeholder="Your Email"
                className="mt-1 mb-5"
                disabled
              />
              <Form
                className="flex flex-col"
                onFinish={onFinish}
                initialValues={{
                  name: userData?.name || "",
                  phone: userData?.phone || "",
                  place: userData?.place || "",
                }}
              >
                <label className="text-md font-medium">Name</label>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      pattern: /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
                      message: "Enter a valid name",
                    },
                    {
                      validator: validateName,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="mt-1"
                  />
                </Form.Item>
                <label className="text-md font-medium">Phone</label>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      pattern: /^\d{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                    {
                      validator: validatePhone,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="mt-1"
                  />
                </Form.Item>
                <label className="text-md font-medium">Place</label>
                <Form.Item
                  name="place"
                  rules={[
                    {
                      pattern: /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
                      message: "Enter a valid place",
                    },
                    {
                      validator: validatePlace,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Place"
                    className="mt-1"
                  />
                </Form.Item>
                <Button
                  size="large"
                  className="text-white font-semibold"
                  htmlType="submit"
                >
                  Update
                </Button>
              </Form>
            </div>
          </div>
        </Card>
      </motion.section>
    </UserLayout>
  );
}

export default Profile;
