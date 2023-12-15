import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Banner from "../../components/user/Banner";
import UserLayout from "../../components/layout/UserLayout";
import { listProject } from "../../api/services/userService";
import { hideLoading, showLoading } from "../../utils/alertSlice";

function Home() {
  const dispatch = useDispatch();
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoading());
        const projectsResponse = await listProject();
        const projects = projectsResponse.data.data;
        setProjectsData(projects);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching data:", error);
        setProjectsData([]);
      }
    };

    fetchData();
  }, [dispatch]);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <UserLayout>
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        <Banner />
        <h1 className="text-3xl font-semibold text-gray-800 my-6 px-4">
          Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20 px-4">
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.05, delay: index * 0.05 }}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-md transition duration-300 ease-in-out"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-60 object-cover object-center"
              />
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {project.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </UserLayout>
  );
}

export default Home;
