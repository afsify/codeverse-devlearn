import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Button, Input } from "antd";
import { useDispatch } from "react-redux";
import Title from "../../components/admin/Title";
import { useEffect, useRef, useState } from "react";
import CourseForm from "../../components/admin/CourseForm";
import AdminLayout from "../../components/layout/AdminLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  listCourse,
  editCourse,
  insertCourse,
  deleteCourse,
} from "../../api/services/adminService";

function CourseManage() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [size] = useState("large");
  const [courses, setCourses] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        dispatch(showLoading());
        const response = await listCourse();
        dispatch(hideLoading());
        const courseData = response.data.data;
        setCourses(courseData);
        setFilteredCourses(courseData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching courses:", error);
        setCourses([]);
        setFilteredCourses([]);
      }
    };
    fetchCourses();
    inputRef.current && inputRef.current.focus();
  }, [dispatch]);

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
        setFilteredCourses(updatedCourses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const insertCourseHandler = async (formData) => {
    try {
      dispatch(showLoading());
      const response = await insertCourse(formData);
      dispatch(hideLoading());
      if (response.data.success) {
        const newCourse = response.data.savedCourse;
        setCourses([...courses, newCourse]);
        setFilteredCourses([...courses, newCourse]);
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

  const editExistingCourseHandler = async (values) => {
    try {
      const response = await editCourse(editData._id, values);
      if (response.data.success) {
        const updatedCoursesResponse = await listCourse();
        const updatedCoursesData = updatedCoursesResponse.data;
        setCourses(updatedCoursesData);
        setFilteredCourses(updatedCoursesData);
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

  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    filterCourses(input);
  };

  const filterCourses = (input) => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const clearSearchInput = () => {
    setSearchInput("");
    setFilteredCourses(courses);
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="flex items-center">
          <Button
            className="text-white flex items-center ms-3"
            onClick={showModal}
          >
            <PlusCircleOutlined />
            Add Course
          </Button>
        </div>
      </Title>
      <div className="flex justify-center mt-3 mb-2">
        <Input
          ref={inputRef}
          placeholder="Search courses"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="rounded-md py-2 w-96"
          prefix={
            <SearchOutlined style={{ color: "#1890ff", marginRight: "5px" }} />
          }
          suffix={
            searchInput && (
              <CloseCircleOutlined
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={clearSearchInput}
              />
            )
          }
        />
      </div>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full table-auto border-collapse border border-gray-300 shadow-md shadow-black">
          <thead className="bg-dark-purple text-white">
            <tr>
              <th className="text-center border border-gray-300 py-2">#</th>
              <th className="text-center border border-gray-300 py-2">Title</th>
              <th className="text-center border border-gray-300 py-2 px-16">
                Videos
              </th>
              <th className="text-center border border-gray-300 py-2">
                Description
              </th>
              <th className="text-center border border-gray-300 py-2">Price</th>
              <th className="text-center border border-gray-300 py-2 px-8">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses &&
              filteredCourses.map((course, index) => (
                <tr key={index} className="bg-gray-100 hover:bg-gray-200">
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {index + 1}
                  </td>
                  <td className="text-center border border-gray-300 py-2">
                    {course.title}
                  </td>
                  <td className="text-center border border-gray-300 py-2 w-48">
                    <div className="flex flex-col gap-2">
                      <a
                        href={course.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group overflow-hidden cursor-pointer rounded-md hover:shadow-md transition duration-300"
                      >
                        <div className="relative">
                          <img
                            src={course.image}
                            alt={`Video Thumbnail ${index + 1}`}
                            className="w-full h-24 object-cover rounded-t-lg transition duration-300 group-hover:opacity-75 relative"
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
                      {course.videos.map((video, index) => (
                        <a
                          href={video}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={index}
                          className="relative group overflow-hidden cursor-pointer rounded-md hover:shadow-md transition duration-300"
                        >
                          <div className="relative">
                            <img
                              src={course.image}
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
                      ))}
                    </div>
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
