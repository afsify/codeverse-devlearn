import Skeleton from "./Skeleton";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { listProject } from "../../api/services/userService";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  GithubOutlined,
  YoutubeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

function ProjectCard() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [projectsData, setProjectsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoading());
        const projectsResponse = await listProject();
        const projects = projectsResponse.data.data;
        setProjectsData(projects);
        setIsLoading(false);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching data:", error);
        setProjectsData([]);
      }
    };

    fetchData();
  }, [dispatch]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  };

  const filteredProjects =
    selectedCategory === "All"
      ? projectsData
      : projectsData.filter((project) => project.category === selectedCategory);

  return (
    <>
      <div className="flex md:justify-between md:flex-row flex-col mb-6 mt-8 px-4">
        <h1 className="text-3xl font-semibold text-gray-800">Projects</h1>
        <div className="flex justify-center space-x-4 my-3 md:my-0">
          {["All", "Static", "EJS", "React", "MERN"].map((category, index) => (
            <motion.div
              key={index}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.1 }}
            >
              <span
                className={`text-black font-semibold cursor-pointer text-lg ${
                  selectedCategory === category &&
                  "border-b-4 border-black rounded-b"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-md transition duration-300 ease-in-out"
              >
                <Skeleton type="image" count={1} width={100} height={48} />
                <div className="px-6 py-4">
                  <div className="w-1/2 mb-3">
                    <Skeleton type="text" count={1} height={5} />
                  </div>
                  <div className="mb-4">
                    <Skeleton type="text" count={1} height={3} />
                    <Skeleton type="text" count={1} height={3} />
                    <Skeleton type="text" count={1} height={3} />
                    <Skeleton type="text" count={1} height={3} />
                    <Skeleton type="text" count={1} height={3} />
                  </div>
                  <div className="flex justify-center gap-x-5">
                    <Skeleton type="circle" count={1} />
                    <Skeleton type="circle" count={1} />
                    <Skeleton type="circle" count={1} />
                  </div>
                </div>
              </div>
            ))
          : filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.05, delay: index * 0.05 }}
                className="bg-white shadow-md rounded-lg overflow-hidden transform hover:shadow-black hover:shadow-md transition duration-300 ease-in-out"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-50 object-cover object-center"
                />
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {project.title}
                    </h2>
                    {project.category && (
                      <span className="px-1 mb-2 bg-gray-700 text-white rounded-md text-xs">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex justify-center gap-x-5">
                    {project.github && (
                      <a
                        href={project?.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 duration-300 hover:text-blue-500"
                      >
                        <GithubOutlined style={{ fontSize: "25px" }} />
                      </a>
                    )}
                    {project.youtube && (
                      <a
                        href={project?.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 duration-300 hover:text-blue-500"
                      >
                        <YoutubeOutlined style={{ fontSize: "28px" }} />
                      </a>
                    )}

                    {project.live && (
                      <a
                        href={project?.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 duration-300 hover:text-blue-500"
                      >
                        <GlobalOutlined style={{ fontSize: "25px" }} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </>
  );
}

export default ProjectCard;
