import { useState } from "react";
import useEdit from "../../hooks/useEdit";
import useFetch from "../../hooks/useFetch";
import useInsert from "../../hooks/useInsert";
import useToggle from "../../hooks/useToggle";
import useDelete from "../../hooks/useDelete";
import Title from "../../components/admin/Title";
import { Button, Empty, Switch, Table, Input } from "antd";
import ProjectForm from "../../components/admin/ProjectForm";
import AdminLayout from "../../components/layout/AdminLayout";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  listProject,
  editProject,
  insertProject,
  projectStatus,
  deleteProject,
} from "../../api/services/adminService";

function ProjectManage() {
  const [size] = useState("large");
  const [editData, setEditData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: project, setData: setProject } = useFetch(listProject);
  const { editItem } = useEdit(editProject, setProject, setIsModalVisible);
  const { toggleStatus } = useToggle(projectStatus, setProject);
  const { deleteItem } = useDelete(deleteProject, setProject);
  const { insertItem } = useInsert(
    insertProject,
    setProject,
    setIsModalVisible
  );

  const insertProjectHandler = async (formData) => {
    insertItem(formData);
  };

  const showEditWindow = (projectToEdit) => {
    setEditData(projectToEdit);
    showModal();
  };

  const editProjectHandler = async (formData) => {
    editItem(editData._id, formData);
  };

  const toggleProjectStatus = async (projectId, currentStatus) => {
    toggleStatus(projectId, currentStatus);
  };

  const deleteProjectHandler = async (projectId) => {
    deleteItem(projectId);
  };

  const filteredData = project.filter((record) =>
    record.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const showDeleteConfirm = (projectId) => {
    const handleDelete = (projectId) => {
      deleteProjectHandler(projectId);
    };
    DeleteConfirm(handleDelete, projectId);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "20%",
      align: "center",
      render: (text, record) => (
        <img src={record.image} alt={record.title} className="rounded-lg" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      filterDropdown: () => (
        <Input
          size="large"
          placeholder="Search Title"
          value={searchInput}
          className="rounded-md w-44"
          onChange={(e) => setSearchInput(e.target.value)}
          prefix={
            <SearchOutlined style={{ color: "#1890ff", marginRight: "5px" }} />
          }
          suffix={
            searchInput && (
              <CloseCircleOutlined
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => setSearchInput("")}
              />
            )
          }
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchInput ? "#1890ff" : undefined }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      width: "30%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => (
        <Switch
          className="bg-light-purple"
          checked={record.status}
          onChange={() => toggleProjectStatus(record._id, record.status)}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <div className="md:space-x-1 space-y-1">
          <Button
            className="text-white"
            icon={<EditOutlined />}
            size={size}
            onClick={() => showEditWindow(record)}
          />
          <Button
            className="text-white"
            icon={<DeleteOutlined />}
            size={size}
            onClick={() => showDeleteConfirm(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button className="text-white flex items-center" onClick={showModal}>
          <PlusCircleOutlined />
          Add Project
        </Button>
      </Title>
      <div className="overflow-x-auto mt-5">
        <Table
          dataSource={filteredData}
          columns={columns}
          bordered
          pagination={{ position: ["bottomCenter"], pageSize: 5 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <span className="text-lg text-gray-500">
                    No projects available.
                  </span>
                }
              />
            ),
          }}
        />
      </div>
      <ProjectForm
        visible={isModalVisible}
        onCreate={editData ? editProjectHandler : insertProjectHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

export default ProjectManage;
