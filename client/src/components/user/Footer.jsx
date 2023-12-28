import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userPath } from "../../routes/routeConfig";
import { getAbout } from "../../api/services/userService";
import {
  GithubOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

function Footer() {
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await getAbout();
        const adminData = response.data.data;
        setAdminData(adminData);
      } catch (error) {
        console.error("Error fetching About:", error);
        setAdminData({});
        fetchAbout();
      }
    };
    fetchAbout();
  }, []);

  const footerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 },
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className="bg-medium-dark text-white text-center p-8"
    >
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="flex justify-center md:justify-start w-full mb-4 md:mb-0">
            <Link to={userPath.home}>
              <h1 className="text-5xl font-signature">Codeverse</h1>
            </Link>
          </div>
          <div className="flex justify-between w-full">
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <ul className="list-none">
                <li>
                  <a
                    href="https://vitejs.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vite JS
                  </a>
                </li>
                <li>
                  <a
                    href="https://tailwindcss.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tailwind
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow us</h3>
              <ul className="list-none">
                <li>
                  <a
                    href={
                      adminData.contact?.github || "https://github.com/example"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={
                      adminData.contact?.linkedIn ||
                      "https://linkedin.com/in/example"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Company</h3>
              <ul className="list-none">
                <li>
                  <Link to={userPath.about}>
                    <span>About us</span>
                  </Link>
                </li>
                <li>
                  <Link to={userPath.contact}>
                    <span>Contact us</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full mt-8 border-t border-gray-600"></div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="text-sm mb-4 md:mb-0 md:mr-4">
            &copy; {new Date().getFullYear()} Codeverse DevLearn <br /> All
            rights reserved
          </div>
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="flex space-x-6 justify-center md:mt-0"
          >
            <motion.a
              href={
                adminData.contact?.linkedIn || "https://linkedin.com/in/example"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 duration-300 hover:text-blue-500"
            >
              <LinkedinOutlined style={{ fontSize: "30px" }} />
            </motion.a>
            <motion.a
              href={adminData.contact?.github || "https://github.com/example"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 duration-300 hover:text-blue-500"
            >
              <GithubOutlined style={{ fontSize: "30px" }} />
            </motion.a>
            <motion.a
              href={adminData.contact?.youtube || "https://wa.me/1234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 duration-300 hover:text-blue-500"
            >
              <YoutubeOutlined style={{ fontSize: "30px" }} />
            </motion.a>
            <motion.a
              href={adminData.contact?.whatsapp || "https://wa.me/1234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 duration-300 hover:text-blue-500"
            >
              <WhatsAppOutlined style={{ fontSize: "30px" }} />
            </motion.a>
            <motion.a
              href={
                adminData.contact?.instagram || "https://instagram.com/example"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 duration-300 hover:text-blue-500"
            >
              <InstagramOutlined style={{ fontSize: "30px" }} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
