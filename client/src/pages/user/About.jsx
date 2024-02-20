import { motion } from "framer-motion";
import { Button, Progress, Card } from "antd";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import imageLinks from "../../assets/images/imageLinks";
import { getAbout } from "../../api/services/userService";
import UserLayout from "../../components/layout/UserLayout";
import { showLoading, hideLoading } from "../../utils/alertSlice";
import {
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  YoutubeOutlined,
  WhatsAppOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

function About() {
  const dispatch = useDispatch();
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        dispatch(showLoading());
        const response = await getAbout();
        dispatch(hideLoading());
        const adminDetail = response.data.data;
        setAdminData(adminDetail);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching About:", error);
        setAdminData({});
      }
    };
    fetchAbout();
  }, [dispatch]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUpTag = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerTag = {
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  function formatNameForCV(name) {
    return name.toUpperCase().replace(/\s+/g, "_") + "_CV" + ".png";
  }

  function getUserId(url, word) {
    if (typeof url === "string" && typeof word === "string") {
      const index = url.lastIndexOf(word);
      if (index !== -1) {
        return url.slice(index + word.length);
      }
    }
    return "";
  }

  const handleDownloadClick = async () => {
    if (adminData?.resume) {
      try {
        const response = await fetch(adminData.resume);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = formatNameForCV(adminData?.name);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }
  };

  return (
    <UserLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="overflow-x-auto rounded-lg shadow-sm shadow-black my-5"
      >
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <h2 className="text-3xl font-semibold mb-4">About</h2>
              <motion.div
                variants={fadeInUp}
                className="flex justify-around mb-6"
              >
                <motion.div
                  variants={fadeInUp}
                  className="rounded-full overflow-hidden w-44 h-44 shadow-md shadow-black"
                >
                  <img
                    src={adminData?.image || imageLinks.profile}
                    alt="Account"
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    variants={fadeInUp}
                    className="relative w-27 h-48 overflow-hidden shadow-sm shadow-black group mb-4"
                  >
                    <img
                      className="object-contain w-full h-full transition-opacity duration-300 ease-in-out group-hover:opacity-50"
                      src={adminData?.resume || imageLinks.vertical}
                      alt="Resume"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-70 bg-black">
                      {adminData?.resume && (
                        <a
                          href={adminData.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-[8px] hover:text-blue-700 hover:underline font-semibold"
                        >
                          {formatNameForCV(adminData?.name)}
                        </a>
                      )}
                    </div>
                  </motion.div>
                  <Button
                    shape="round"
                    size="small"
                    onClick={handleDownloadClick}
                    className="bg-blue-500 text-white"
                  >
                    Download CV
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h1 className="text-2xl font-semibold mb-1">
                  {adminData?.name}
                </h1>
                <p className="text-gray-500 font-sans mb-1">
                  <a
                    className="me-2 hover:text-blue-500"
                    href={`mailto:${adminData?.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MailOutlined />
                  </a>
                  {adminData?.email}
                </p>
                <p className="text-gray-500 font-sans mb-1">
                  <a
                    className="me-2 hover:text-blue-500"
                    href={`tel:${adminData?.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PhoneOutlined />
                  </a>
                  {adminData?.phone}
                </p>
                <p className="text-gray-500 font-sans max-w-[250px] mb-4">
                  <a
                    className="me-2 hover:text-blue-500"
                    href={`https://www.google.com/maps/search/?api=1&query=${adminData?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <EnvironmentOutlined />
                  </a>
                  {adminData?.address}
                </p>
              </motion.div>
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <motion.div
                variants={staggerTag}
                className="flex flex-wrap justify-center md:justify-start items-center gap-5 px-5 min-h-[80px]"
              >
                <motion.a
                  variants={fadeInUpTag}
                  href={
                    adminData.contact?.linkedIn ||
                    "https://linkedin.com/in/example"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:scale-125 duration-300 hover:text-[#0366c3]"
                >
                  <LinkedinOutlined style={{ fontSize: "40px" }} />
                  <p className="hidden text-[9px] text-center group-hover:grid font-semibold font-sans">
                    {getUserId(adminData.contact?.linkedIn, "/")}
                  </p>
                </motion.a>
                <motion.a
                  variants={fadeInUpTag}
                  href={
                    adminData.contact?.github || "https://github.com/example"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:scale-125 duration-300 hover:text-[#9e5eb8]"
                >
                  <GithubOutlined style={{ fontSize: "40px" }} />
                  <p className="hidden text-[9px] text-center group-hover:grid font-semibold font-sans">
                    {getUserId(adminData.contact?.github, "/")}
                  </p>
                </motion.a>
                <motion.a
                  variants={fadeInUpTag}
                  href={
                    adminData.contact?.youtube ||
                    "https://www.youtube.com/@example"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:scale-125 duration-300 hover:text-[#ff0000]"
                >
                  <YoutubeOutlined style={{ fontSize: "40px" }} />
                  <p className="hidden text-[9px] text-center group-hover:grid font-semibold font-sans">
                    {getUserId(adminData.contact?.youtube, "/")}
                  </p>
                </motion.a>
                <motion.a
                  variants={fadeInUpTag}
                  href={
                    adminData.contact?.whatsapp || "https://wa.me/1234567890"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:scale-125 duration-300 hover:text-[#119e06]"
                >
                  <WhatsAppOutlined style={{ fontSize: "40px" }} />
                  <a className="hidden text-[5px] text-center group-hover:grid font-semibold font-sans">
                    {getUserId(adminData.contact?.whatsapp, "/")}
                  </a>
                </motion.a>
                <motion.a
                  variants={fadeInUpTag}
                  href={
                    adminData.contact?.instagram ||
                    "https://instagram.com/example"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:scale-125 duration-300 hover:text-[#ea0120]"
                >
                  <InstagramOutlined style={{ fontSize: "40px" }} />
                  <p className="hidden text-[9px] text-center group-hover:grid font-semibold font-sans">
                    {getUserId(adminData.contact?.instagram, "/")}
                  </p>
                </motion.a>
              </motion.div>
            </div>
            <motion.div variants={fadeInUp} className="md:mt-10">
              <h2 className="text-lg font-semibold mb-2">Education</h2>
              <motion.ul
                variants={fadeInUp}
                className="list-disc ml-6 font-sans"
              >
                {adminData.education?.map((edu, index) => (
                  <motion.li key={index} className="mb-2 last:mb-0">
                    {edu.institution} - {edu.course} ({edu.branch}), Graduated
                    in {edu.year}
                  </motion.li>
                ))}
              </motion.ul>
              <h2 className="text-lg font-semibold mt-5 mb-2">Skills</h2>
              <motion.div
                variants={stagger}
                className="flex md:justify-between flex-wrap px-2"
              >
                <motion.ul variants={fadeInUp} className="font-sans space-y-4">
                  {adminData.skill
                    ?.slice(0, Math.ceil(adminData.skill.length / 2))
                    .map((skill, index) => (
                      <motion.li
                        key={index}
                        variants={fadeInUp}
                        className="mb-4 last:mb-0"
                      >
                        <div className="flex items-center">
                          <div className="min-w-[100px]">
                            <p className="font-semibold">{skill.name}</p>
                          </div>
                          <div className="w-56">
                            <Progress
                              percent={skill.proficiency}
                              status="active"
                              width={56}
                            />
                          </div>
                        </div>
                      </motion.li>
                    ))}
                </motion.ul>
                <motion.ul
                  variants={fadeInUp}
                  className="font-sans mt-4 md:mt-0 space-y-4"
                >
                  {adminData.skill
                    ?.slice(Math.ceil(adminData.skill.length / 2))
                    .map((skill, index) => (
                      <motion.li
                        key={index}
                        variants={fadeInUp}
                        className="mb-4 last:mb-0"
                      >
                        <div className="flex items-center">
                          <div className="min-w-[100px]">
                            <p className="font-semibold">{skill.name}</p>
                          </div>
                          <div className="w-56">
                            <Progress
                              percent={skill.proficiency}
                              status="active"
                              width={56}
                            />
                          </div>
                        </div>
                      </motion.li>
                    ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </UserLayout>
  );
}

export default About;
