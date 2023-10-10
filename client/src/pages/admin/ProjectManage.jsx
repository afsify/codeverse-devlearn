import { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Empty, Button, Modal, Switch } from "antd";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  listProject,
  insertProject,
  editProject,
  projectStatus,
  deleteProject,
} from "../../api/services/adminService";
import Title from "../../components/admin/Title";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import ProjectForm from "../../components/admin/ProjectForm";

function ProjectManage() {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const [size] = useState("large");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        dispatch(showLoading());
        const response = await listProject();
        dispatch(hideLoading());
        const projectData = response.data.data;
        setProjects(projectData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, [dispatch]);

  const insertProjectHandler = async (formData) => {
    try {
      dispatch(showLoading());
      const response = await insertProject(formData);
      dispatch(hideLoading());
      if (response.data.success) {
        const newProject = response.data.savedProject;
        setProjects([...projects, newProject]);
        setIsModalVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const editProjectHandler = (
    projectId,
    image,
    title,
    description,
    github,
    link
  ) => {
    const projectToEdit = {
      _id: projectId,
      image: image,
      title: title,
      description: description,
      github: github,
      link: link,
    };
    setEditData(projectToEdit);
    showModal();
  };

  const editExistingProjectHandler = async (formData) => {
    try {
      const response = await editProject(editData._id, formData);
      if (response.data.success) {
        const updatedProject = response.data.savedProject;
        const updatedProjects = projects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        );
        setProjects(updatedProjects);
        setIsModalVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const toggleProjectStatus = async (projectId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await projectStatus(projectId, newStatus);
      if (response.data.success) {
        const updatedProjectsResponse = await listProject();
        const updatedProjectsData = updatedProjectsResponse.data;
        setProjects(updatedProjectsData);
        toast.success(response.data.message);
        const updatedProjects = projects.map((project) =>
          project._id === projectId
            ? { ...project, status: newStatus }
            : project
        );
        setProjects(updatedProjects);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const deleteProjectHandler = async (projectId) => {
    try {
      const response = await deleteProject(projectId);
      if (response.data.success) {
        const updatedProjects = projects.filter(
          (project) => project._id !== projectId
        );
        setProjects(updatedProjects);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const { confirm } = Modal;

  const showDeleteConfirm = (projectId) => {
    confirm({
      title: "Are you sure you want to delete this project?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        deleteProjectHandler(projectId);
      },
      onCancel() {},
    });
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button className="text-white flex items-center" onClick={showModal}>
          <PlusCircleOutlined />
          Add Project
        </Button>
      </Title>
      <div className="overflow-x-auto rounded-xl mt-5">
        <table className="w-full table-auto border-collapse border border-gray-300 shadow-md shadow-black">
          <thead className="bg-dark-purple text-white">
            <tr>
              <th className="text-center border border-gray-300 py-2">#</th>
              <th className="text-center border border-gray-300">Image</th>
              <th className="text-center border border-gray-300 py-2">Title</th>
              <th className="text-center border border-gray-300 py-2">
                Description
              </th>
              <th className="text-center border border-gray-300 py-2">
                Status
              </th>
              <th className="text-center border border-gray-300 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-14">
                  <div className="flex justify-center items-center h-full">
                    <Empty
                      description={
                        <span className="text-lg text-gray-500">
                          No projects available.
                        </span>
                      }
                    />
                  </div>
                </td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr key={project._id} className="bg-gray-100 hover:bg-gray-200">
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 flex justify-center">
                    <img
                      src={project.image}
                      alt={project.title}
                      width="200"
                      className="rounded-lg"
                    />
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    {project.title}
                  </td>
                  <td className="text-center border border-gray-300 py-2 max-w-md">
                    {project.description}
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    <Switch
                      className="bg-light-purple"
                      checked={project.status}
                      onChange={() =>
                        toggleProjectStatus(project._id, project.status)
                      }
                    />
                  </td>
                  <td className="text-center border border-gray-300">
                    <Button
                      icon={<EditOutlined />}
                      size={size}
                      onClick={() =>
                        editProjectHandler(
                          project._id,
                          project.image,
                          project.title,
                          project.description,
                          project.github,
                          project.link
                        )
                      }
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      size={size}
                      onClick={() => showDeleteConfirm(project._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ProjectForm
        visible={isModalVisible}
        onCreate={editData ? editExistingProjectHandler : insertProjectHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

export default ProjectManage;
