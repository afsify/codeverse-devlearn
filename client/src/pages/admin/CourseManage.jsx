import { useState } from "react";
import useEdit from "../../hooks/useEdit";
import useFetch from "../../hooks/useFetch";
import useInsert from "../../hooks/useInsert";
import useToggle from "../../hooks/useToggle";
import useDelete from "../../hooks/useDelete";
import Title from "../../components/admin/Title";
import CourseForm from "../../components/admin/CourseForm";
import AdminLayout from "../../components/layout/AdminLayout";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import { Button, Empty, Switch, Table, Input, Collapse, Badge } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import {
  listCourse,
  editCourse,
  courseStatus,
  insertCourse,
  deleteCourse,
} from "../../api/services/adminService";

function CourseManage() {
  const [size] = useState("large");
  const [editData, setEditData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: course, setData: setCourse } = useFetch(listCourse);
  const { insertItem } = useInsert(insertCourse, setCourse, setIsModalVisible);
  const { editItem } = useEdit(editCourse, setCourse, setIsModalVisible);
  const { toggleStatus } = useToggle(courseStatus, setCourse);
  const { deleteItem } = useDelete(deleteCourse, setCourse);

  const insertCourseHandler = async (formData) => {
    insertItem(formData);
  };

  const showEditWindow = (courseToEdit) => {
    setEditData(courseToEdit);
    showModal();
  };

  const editCourseHandler = async (formData) => {
    editItem(editData._id, formData);
  };

  const toggleCourseStatus = async (courseId, currentStatus) => {
    toggleStatus(courseId, currentStatus);
  };

  const deleteCourseHandler = async (courseId) => {
    deleteItem(courseId);
  };

  const filteredData = course.filter((record) =>
    record.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const showDeleteConfirm = (courseId) => {
    const handleDelete = (courseId) => {
      deleteCourseHandler(courseId);
    };
    DeleteConfirm(handleDelete, courseId);
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
      title: "Videos",
      dataIndex: "videos",
      key: "videos",
      align: "center",
      width: "20%",
      render: (videos, record) => (
        <div className="flex flex-col gap-2">
          <a
            href={record.preview}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden cursor-pointer rounded-md hover:shadow-md transition duration-300"
          >
            <div className="relative">
              <img
                src={record.image}
                alt="Preview Thumbnail"
                className="w-full h-32 object-cover rounded-t-lg transition duration-300 group-hover:opacity-75 relative"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition duration-300 group-hover:bg-opacity-75">
                <PlayCircleOutlined className="text-white text-4xl opacity-40 group-hover:opacity-100 transition duration-300" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-2">
              <p className="text-white text-xs font-semibold font-sans group-hover:underline">
                Preview
              </p>
            </div>
          </a>
          <Collapse>
            <Collapse.Panel
              header={
                <div>
                  <span>Videos</span>
                  <Badge
                    size="small"
                    color="blue"
                    count={videos.length}
                    className="ml-1"
                  />
                </div>
              }
            >
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="my-2 overflow-hidden cursor-pointer rounded-md"
                >
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group overflow-hidden cursor-pointer rounded-md hover:shadow-md transition duration-300"
                  >
                    <div className="relative">
                      <img
                        src={record.image}
                        alt={`Video Thumbnail ${index + 1}`}
                        className="w-full h-24 object-cover rounded-t-lg transition duration-300 group-hover:opacity-75 relative"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition duration-300 group-hover:bg-opacity-75">
                        <PlayCircleOutlined className="text-white text-4xl opacity-40 group-hover:opacity-100 transition duration-300" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-2">
                      <p className="text-white text-xs font-semibold font-sans group-hover:underline">
                        Video {index + 1}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </Collapse.Panel>
          </Collapse>
        </div>
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text, record) => <>₹{record.price}</>,
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
          onChange={() => toggleCourseStatus(record._id, record.status)}
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
        <h2 className="text-xl font-semibold">Courses</h2>
        <Button className="text-white flex items-center" onClick={showModal}>
          <PlusCircleOutlined />
          Add Course
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
                    No courses available.
                  </span>
                }
              />
            ),
          }}
        />
      </div>
      <CourseForm
        visible={isModalVisible}
        onCreate={editData ? editCourseHandler : insertCourseHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

export default CourseManage;
