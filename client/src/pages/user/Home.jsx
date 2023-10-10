import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import UserLayout from "../../components/layout/UserLayout";
import Banner from "../../components/user/Banner";
import ProjectCard from "../../components/user/ProjectCard";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { listProject } from "../../api/services/adminService";

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

  return (
    <UserLayout>
      <Banner />
      <h1 className="text-2xl font-semibold text-gray-800 my-6">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {projectsData.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </UserLayout>
  );
}

export default Home;
