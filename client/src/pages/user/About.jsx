import { Button } from "antd";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import imageLinks from "../../assets/images/imageLinks";
import { getAbout } from "../../api/services/userService";
import UserLayout from "../../components/layout/UserLayout";
import { showLoading, hideLoading } from "../../utils/alertSlice";

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
        className="overflow-x-auto bg-white rounded-lg shadow-sm shadow-black my-5 p-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <h1 className="text-2xl font-semibold mb-1">{adminData?.name}</h1>
              <p className="text-gray-600 font-sans mb-1">{adminData?.email}</p>
              <p className="text-gray-600 font-sans mb-1">{adminData?.phone}</p>
              <p className="text-gray-600 font-sans mb-4">
                {adminData?.address}
              </p>
            </motion.div>
            <h2 className="text-lg font-semibold mb-2">Contact</h2>
            <motion.ul variants={fadeInUp} className="list-disc ml-6 font-sans">
              <motion.li>
                GitHub:{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline font-semibold"
                  href={adminData.contact?.github}
                >
                  {getUserId(adminData.contact?.github, "/")}
                </a>
              </motion.li>
              <motion.li>
                LinkedIn:{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline font-semibold"
                  href={adminData.contact?.linkedIn}
                >
                  {getUserId(adminData.contact?.linkedIn, "/")}
                </a>
              </motion.li>
              <motion.li>
                Instagram:{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline font-semibold"
                  href={adminData.contact?.instagram}
                >
                  {getUserId(adminData.contact?.instagram, "/")}
                </a>
              </motion.li>
              <motion.li>
                WhatsApp:{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline font-semibold"
                  href={adminData.contact?.whatsapp}
                >
                  {getUserId(adminData.contact?.whatsapp, "/")}
                </a>
              </motion.li>
            </motion.ul>
          </div>
          <motion.div variants={fadeInUp} className="md:mt-10">
            <h2 className="text-lg font-semibold mb-2">Education</h2>
            <motion.ul variants={fadeInUp} className="list-disc ml-6 font-sans">
              {adminData.education?.map((edu, index) => (
                <motion.li key={index} className="mb-2 last:mb-0">
                  {edu.institution} - {edu.course} ({edu.branch}), Graduated in{" "}
                  {edu.year}
                </motion.li>
              ))}
            </motion.ul>
            <h2 className="text-lg font-semibold mt-5 mb-2">Skills</h2>
            <motion.ul variants={fadeInUp} className="list-disc ml-6 font-sans">
              {adminData.skill?.map((skill, index) => (
                <motion.li key={index} className="mb-2 last:mb-0">
                  {skill.name} - {skill.proficiency} level
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
    </UserLayout>
  );
}

export default About;
