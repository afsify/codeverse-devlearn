import Skeleton from "./Skeleton";
import { motion } from "framer-motion";
import { Card, Typography } from "antd";
import { useState, useEffect, Fragment } from "react";
import { listProject } from "../../api/services/userService";
import {
  GithubOutlined,
  YoutubeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

function ProjectCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [projectsData, setProjectsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await listProject();
        const projects = projectsResponse.data.data;
        setProjectsData(projects);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProjectsData([]);
        fetchData();
      }
    };
    fetchData();
  }, []);

  const categories = [
    "All",
    ...new Set(projectsData.map((project) => project.category)),
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const filteredProjects =
    selectedCategory === "All"
      ? projectsData
      : projectsData.filter((project) => project.category === selectedCategory);

  return (
    <Fragment>
      <div className="flex md:justify-between md:flex-row flex-col mb-6 mt-8 px-4">
        <Title level={2}>Projects</Title>
        <div className="flex justify-center space-x-4 my-3 md:my-0">
          {categories.map((category, index) => (
            <div key={index} className="hover:text-blue-500">
              <Title
                className={`font-semibold cursor-pointer text-lg ${
                  selectedCategory === category && "border-b-4  rounded-b"
                }`}
                onClick={() => setSelectedCategory(category)}
                level={5}
              >
                {category}
              </Title>
            </div>
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
                    <Skeleton type="text" count={1} />
                  </div>
                  <div className="mb-4">
                    <Skeleton type="text" count={1} />
                    <Skeleton type="text" count={1} />
                    <Skeleton type="text" count={1} />
                    <Skeleton type="text" count={1} />
                    <Skeleton type="text" count={1} />
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
                className="col-span-1 transform rounded-lg transition duration-300"
              >
                <Card
                  cover={
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-50 object-cover object-center"
                    />
                  }
                  className="shadow-md rounded-lg hover:scale-105 hover:shadow-xl duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold  mb-2">
                      {project.title}
                    </h2>
                    {project.category && (
                      <span className="px-1 mb-2 bg-gray-700 text-white rounded-md text-xs">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
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
                </Card>
              </motion.div>
            ))}
      </div>
    </Fragment>
  );
}

export default ProjectCard;
