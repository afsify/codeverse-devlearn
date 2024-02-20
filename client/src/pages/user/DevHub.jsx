import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import imageLinks from "../../assets/images/imageLinks";
import UserLayout from "../../components/layout/UserLayout";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { createDev, listDev } from "../../api/services/userService";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Tag, Card, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

function DevHub() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [dev, setDev] = useState([]);
  const service = location?.state.service;
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const logged = localStorage.getItem("userToken") !== null;
  const [experienceOptions] = useState([
    "0-1 Years",
    "1-3 Years",
    "3-5 Years",
    "5+ Years",
  ]);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (removedSkill) => {
    const updatedSkills = skills.filter((skill) => skill !== removedSkill);
    setSkills(updatedSkills);
  };

  const validateGitHub = (rule, value, callback) => {
    const pattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+$/;
    if (!value) {
      callback("GitHub URL is required");
    } else if (!pattern.test(value)) {
      callback("Invalid GitHub URL");
    } else {
      callback();
    }
  };

  const validateLinkedIn = (rule, value, callback) => {
    const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/;
    if (!value) {
      callback("LinkedIn URL is required");
    } else if (!pattern.test(value)) {
      callback("Invalid LinkedIn URL");
    } else {
      callback();
    }
  };

  const onFinish = async (values) => {
    try {
      values.skills = skills;
      dispatch(showLoading());
      const response = await createDev(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        const serviceData = response.data.data;
        setDev(serviceData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (logged) {
      const fetchDev = async () => {
        try {
          dispatch(showLoading());
          const response = await listDev();
          dispatch(hideLoading());
          const serviceData = response.data.data;
          setDev(serviceData);
        } catch (error) {
          dispatch(hideLoading());
          console.error("Error fetching dev:", error);
          setDev([]);
        }
      };
      fetchDev();
    }
  }, [dispatch, logged]);

  return (
    <UserLayout>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="shadow-sm rounded-lg p-4"
        >
          <div className="relative w-full h-40 sm:h-80 md:h-[500px]">
            <img
              alt={service.title}
              src={service.image}
              className="w-full h-full object-cover rounded-lg mb-4"
            />
          </div>
          <div className="flex justify-center items-center flex-col">
            <Title className="mt-4" level={2}>
              {service.title}
            </Title>

            <p className="text-gray-500 text-center md:w-1/2 mb-4">
              {service.description}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center mt-3 gap-y-2 md:justify-evenly">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="shadow-md rounded-lg w-full max-w-md"
            >
              <Card className="p-2">
                <h2 className="text-2xl font-bold mb-5 text-center uppercase">
                  Developer Form
                </h2>
                <Form className="flex flex-col gap-2" onFinish={onFinish}>
                  <Form.Item
                    name="type"
                    rules={[{ required: true, message: "Type is required" }]}
                  >
                    <Select placeholder="Select Type ">
                      <Option value="App Developer">App Developer</Option>
                      <Option value="Web Developer">Web Developer</Option>
                      <Option value="Game Developer">Game Developer</Option>
                      <Option value="UI/UX Designer">UI/UX Designer</Option>
                      <Option value="AI/ML Developer">AI/ML Developer</Option>
                      <Option value="DevOps Engineer">DevOps Engineer</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="domain"
                    rules={[{ required: true, message: "Domain is required" }]}
                  >
                    <Select placeholder="Select Domain">
                      <Option value="Flutter">Flutter</Option>
                      <Option value="React Native">React Native</Option>
                      <Option value="Xamarin">Xamarin</Option>
                      <Option value="MERN Stack">MERN Stack</Option>
                      <Option value="MEAN Stack">MEAN Stack</Option>
                      <Option value="Python Django">Python Django</Option>
                      <Option value="PHP Laravel">PHP Laravel</Option>
                      <Option value="Spring Boot">Spring Boot</Option>
                      <Option value="Ruby on Rails">Ruby on Rails</Option>
                      <Option value="Unity 3D">Unity 3D</Option>
                      <Option value="Unreal Engine">Unreal Engine</Option>
                      <Option value="Figma">Figma</Option>
                      <Option value="Adobe XD">Adobe XD</Option>
                      <Option value="Sketch">Sketch</Option>
                      <Option value="TensorFlow">TensorFlow</Option>
                      <Option value="PyTorch">PyTorch</Option>
                      <Option value="Data Scientist">Data Scientist</Option>
                      <Option value="NLP">NLP</Option>
                      <Option value="AWS">AWS</Option>
                      <Option value="Azure">Azure</Option>
                      <Option value="Google Cloud">Google Cloud</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="github"
                    rules={[{ validator: validateGitHub }]}
                  >
                    <Input placeholder="GitHub Profile URL" />
                  </Form.Item>
                  <Form.Item
                    name="linkedin"
                    rules={[{ validator: validateLinkedIn }]}
                  >
                    <Input placeholder="LinkedIn Profile URL" />
                  </Form.Item>
                  <Form.Item
                    name="experience"
                    rules={[
                      { required: true, message: "Experience is required" },
                    ]}
                  >
                    <Select placeholder="Select Experience">
                      {experienceOptions.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="skills"
                    rules={[{ required: true, message: "Skills are required" }]}
                  >
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-x-2">
                        <Input
                          placeholder="Add skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <Button
                          style={{ color: "white" }}
                          icon={<PlusOutlined />}
                          onClick={handleAddSkill}
                        />
                      </div>
                      <div className="w-full mt-2">
                        {skills.map((skill) => (
                          <Tag
                            key={skill}
                            closable
                            onClose={() => handleRemoveSkill(skill)}
                          >
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Form.Item>
                  <Button
                    className="hover:scale-105 duration-300"
                    style={{ color: "white" }}
                    size="large"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="shadow-md rounded-lg p-8 w-full max-w-md"
            >
              <Card>
                <h2 className="text-2xl font-bold mb-3 text-center uppercase">
                  Welcome to DevHub!
                </h2>
                {dev?.user ? (
                  <>
                    {dev?.status === "accepted" ? (
                      <p className="text-gray-500 text-center">
                        Congratulations! Your Developer Form has been approved.
                        You are now part of the DevHub community, and your
                        profile is visible for other users to discover and
                        connect with you. Welcome to DevHub, where great minds
                        come together!
                      </p>
                    ) : (
                      <p className="text-gray-500 text-center">
                        Thank you for submitting your Developer Form! Your
                        details have been received. Please note that the form
                        will undergo admin verification. Once approved, your
                        status will be updated. If rejected, the status will be
                        marked as rejected.
                      </p>
                    )}
                    <div className="shadow-lg rounded-lg p-6 md:w-80 mx-auto mt-3">
                      <div className="flex items-center justify-between pb-3 border-b-2">
                        <div className="overflow-hidden rounded-full w-20 h-20 shadow-md">
                          <img
                            src={dev.user?.image || imageLinks.profile}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center mx-auto items-center text-xl font-semibold text-center mb-2">
                          <span>
                            {dev.user?.name}
                            {dev.user?.developer && (
                              <TokenRoundedIcon
                                className="ml-1 mb-1"
                                sx={{ fontSize: 16, color: "green" }}
                              />
                            )}
                          </span>
                          <span className="text-sm font-normal normal-case font-sans text-gray-500">
                            {dev?.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-center font-sans text-gray-500">
                          {dev.domain}
                        </p>
                        <p className="text-center font-sans text-gray-500">
                          {dev.experience}
                        </p>
                      </div>
                      <div className="flex flex-wrap overflow-y-auto max-h-[59px] justify-center mt-2">
                        {dev.skills.map((skill) => (
                          <Tag key={skill} className="mb-2 mx-1">
                            {skill}
                          </Tag>
                        ))}
                      </div>
                      <div className="flex justify-between gap-x-3">
                        <a
                          href={
                            dev.linkedin || "https://linkedin.com/in/example"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 duration-300 hover:text-[#0366c3]"
                        >
                          <LinkedinOutlined style={{ fontSize: "30px" }} />
                        </a>
                        <a
                          href={dev.github || "https://github.com/example"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 duration-300 hover:text-[#9e5eb8]"
                        >
                          <GithubOutlined style={{ fontSize: "30px" }} />
                        </a>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-semibold capitalize rounded-full ${
                          dev.status === "requested"
                            ? "bg-blue-500 text-white"
                            : dev.status === "accepted"
                            ? "bg-green-500 text-white"
                            : dev.status === "rejected"
                            ? "bg-red-500 text-white"
                            : dev.status === "removed"
                            ? "bg-gray-500 text-white"
                            : ""
                        }`}
                      >
                        {dev.status}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 text-center">
                    Thank you for choosing DevHub! To become a registered
                    member, please fill out the Developer Form for verification.
                    Once approved, your status will be updated, and you&apos;ll
                    be listed as a DevHub developer with a special developer
                    badge!
                    <TokenRoundedIcon
                      className="ml-1 mb-1"
                      sx={{ fontSize: 18, color: "green" }}
                    />
                  </p>
                )}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </UserLayout>
  );
}

export default DevHub;
