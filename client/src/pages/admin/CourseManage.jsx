import { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Modal, Form, Input, Upload } from "antd";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  deleteCourse,
  listCourse,
  insertCourse,
  editCourse,
} from "../../api/services/adminService";
import Title from "../../components/admin/Title";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { cloudUpload } from "../../api/cloudinary";
import PropTypes from "prop-types";

function CourseForm({ visible, onCreate, onCancel, editData }) {
  const [form] = Form.useForm();
  const [videoUrls, setVideoUrls] = useState(editData ? editData.videos : []);
  const [imageFile, setImageFile] = useState(editData ? editData.image : "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    }
  }, [editData, form]);

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      const response = await cloudUpload(formData);
      setImageFile(response.data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setUploading(false);
    }
  };

  const handleVideoUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      const response = await cloudUpload(formData);
      const newVideoUrl = response.data.secure_url;
      setVideoUrls([...videoUrls, newVideoUrl]);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading video to Cloudinary:", error);
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      form.resetFields();
      onCreate({ ...values, videos: videoUrls, image: imageFile });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const removeVideo = (url) => {
    const updatedUrls = videoUrls.filter((video) => video !== url);
    setVideoUrls(updatedUrls);
  };

  return (
    <Modal
      visible={visible}
      title={editData ? "Edit Course" : "Insert Course"}
      okText={editData ? "Save" : "Create"}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please Enter a Title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please Enter a Description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please Enter a Price" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Image">
          <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            customRequest={({ file }) => handleImageUpload(file)}
          >
            {imageFile ? (
              <img
                src={imageFile}
                alt="Course Image"
                style={{ maxWidth: "100%" }}
              />
            ) : (
              <Button icon={<PlusCircleOutlined />}>Upload Image</Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="Video Upload">
          <Upload
            name="video"
            showUploadList={false}
            customRequest={({ file }) => handleVideoUpload(file)}
          >
            <Button icon={<UploadOutlined />}>Upload Video</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Video URLs">
          {videoUrls.map((videoUrl, index) => (
            <div key={index}>
              <Input
                type="text"
                placeholder="Enter Video URL"
                value={videoUrl}
                readOnly
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => removeVideo(videoUrl)}
              />
            </div>
          ))}
        </Form.Item>
        <Form.Item>
          <Button
            type="dashed"
            icon={<PlusCircleOutlined />}
            onClick={() => setVideoUrls([...videoUrls, ""])}
          >
            Add Video URL
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

function CourseManage() {
  const dispatch = useDispatch();

  const [courses, setCourses] = useState([]);
  const [size] = useState("large");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        dispatch(showLoading());
        const response = await listCourse();
        dispatch(hideLoading());
        const courseData = response.data.data;
        setCourses(courseData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const editCourseHandler = (courseId, title, description) => {
    const courseToEdit = {
      _id: courseId,
      title: title,
      description: description,
    };
    setEditData(courseToEdit);
    showModal();
  };

  const deleteCourseHandler = async (courseId) => {
    try {
      const response = await deleteCourse(courseId);
      if (response.data.success) {
        const updatedCourses = courses.filter(
          (course) => course._id !== courseId
        );
        setCourses(updatedCourses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const insertCourseHandler = async (values) => {
    try {
      const response = await insertCourse(values);
      if (response.data.success) {
        const updatedCoursesResponse = await listCourse();
        const updatedCoursesData = updatedCoursesResponse.data;
        setCourses(updatedCoursesData);
        setIsModalVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const editExistingCourseHandler = async (values) => {
    try {
      const response = await editCourse(editData._id, values);
      if (response.data.success) {
        const updatedCoursesResponse = await listCourse();
        const updatedCoursesData = updatedCoursesResponse.data;
        setCourses(updatedCoursesData);
        setIsModalVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Courses</h2>
        <Button className="text-white flex items-center" onClick={showModal}>
          <PlusCircleOutlined />
          Add Course
        </Button>
      </Title>

      <div className="overflow-x-auto rounded-xl mt-5">
        <table className="w-full table-auto border-collapse border border-gray-300 shadow-md shadow-black">
          <thead className="bg-dark-purple text-white">
            <tr>
              <th className="text-center border border-gray-300 py-2">#</th>
              <th className="text-center border border-gray-300 py-2">Title</th>
              <th className="text-center border border-gray-300 py-2">
                Videos
              </th>
              <th className="text-center border border-gray-300 py-2">
                Description
              </th>
              <th className="text-center border border-gray-300 py-2">Price</th>
              <th className="text-center border border-gray-300 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {courses &&
              courses.map((course, index) => (
                <tr
                  key={course._id}
                  className="bg-gray-100 hover:bg-gray-200"
                >
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {index + 1}
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    {course.title}
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    {course.videos.map((video, index) => (
                      <div key={index}>
                        <iframe
                          width="186"
                          height="105"
                          src={video}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ))}
                  </td>
                  <td className="text-center border border-gray-300 py-2 max-w-md">
                    {course.description}
                  </td>
                  <td className="text-center border border-gray-300 py-2 font-sans">
                    ₹{course.price}
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    <Button
                      className="me-3"
                      type="primary"
                      icon={<EditOutlined />}
                      size={size}
                      onClick={() =>
                        editCourseHandler(
                          course._id,
                          course.title,
                          course.description
                        )
                      }
                    />
                    <Button
                      type="primary"
                      icon={<DeleteOutlined />}
                      size={size}
                      onClick={() => deleteCourseHandler(course._id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <CourseForm
        visible={isModalVisible}
        onCreate={editData ? editExistingCourseHandler : insertCourseHandler}
        onCancel={handleCancel}
        editData={editData}
      />
    </AdminLayout>
  );
}

CourseForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default CourseManage;
