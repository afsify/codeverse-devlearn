import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { userPath } from "../../routes/routeConfig";
import { Button, Input, Tooltip, Pagination, Card, Typography } from "antd";
import UserLayout from "../../components/layout/UserLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  listOrder,
  listCourse,
  createOrder,
} from "../../api/services/userService";
import {
  SearchOutlined,
  PlaySquareOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

function Course() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [itemsPerPage] = useState(8);
  const [courses, setCourses] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        dispatch(showLoading());
        const response = await listOrder();
        dispatch(hideLoading());
        const userOrderData = response.data.data;
        setUserOrders(userOrderData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching user orders:", error);
        setUserOrders([]);
      }
    };
    fetchUserOrders();
  }, [dispatch]);

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
  }, [dispatch]);

  const handlePaymentSuccess = async (token, course) => {
    try {
      dispatch(showLoading());
      const values = { token, course };
      const response = await createOrder(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error creating order:", error);
      toast.error("Something went wrong");
    }
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <UserLayout>
      <div className="px-4 pb-3 flex items-center justify-between">
        <Title level={2}>Courses</Title>
        <div className="flex items-center gap-x-2">
          {userOrders.length > 0 && (
            <Tooltip title="Library" placement="top">
              <PlaySquareOutlined
                className="text-4xl cursor-pointer text-blue-500"
                onClick={() => navigate(userPath.library)}
              />
            </Tooltip>
          )}
          <Input
            placeholder="Search courses"
            value={searchInput}
            onChange={handleSearchInputChange}
            className="rounded-md py-2 w-44"
            prefix={
              <SearchOutlined
                style={{ color: "#1890ff", marginRight: "5px" }}
              />
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
        {currentCourses.map((course, index) => (
          <motion.div
            key={course._id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.05, delay: index * 0.05 }}
            className="col-span-1 transform rounded-lg transition duration-300"
          >
            <motion.div>
              <Card
                cover={
                  <img
                    onClick={() =>
                      navigate(`${userPath.courseDetail}`, {
                        state: { course },
                      })
                    }
                    alt={course.title}
                    src={course.image}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                }
                className="shadow-md rounded-lg hover:scale-105 hover:shadow-xl duration-300 overflow-hidden cursor-pointer"
              >
                <h3
                  className="text-lg font-semibold mb-2 cursor-pointer"
                  onClick={() =>
                    navigate(`${userPath.courseDetail}`, {
                      state: { course },
                    })
                  }
                >
                  {course.title}
                </h3>
                <p
                  className="text-gray-500 text-base cursor-pointer"
                  onClick={() =>
                    navigate(`${userPath.courseDetail}`, {
                      state: { course },
                    })
                  }
                >
                  {course.description}
                </p>
                {userOrders.some((order) => order.courseId === course._id) ? (
                  <Button
                    size="large"
                    className="mt-5 w-full font-semibold"
                    disabled
                  >
                    Purchased
                  </Button>
                ) : (
                  <StripeCheckout
                    token={(token) => handlePaymentSuccess(token, course)}
                    stripeKey={import.meta.env.VITE_STRIPE_KEY}
                    name={course.title}
                    amount={course.price * 100}
                    currency="INR"
                    locale="auto"
                  >
                    <Button
                      size="large"
                      className="mt-5 w-full font-semibold"
                      style={{
                        backgroundColor: "transparent",
                      }}
                      htmlType="submit"
                    >
                      ₹{course.price}
                    </Button>
                  </StripeCheckout>
                )}
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-8"
      >
        <Pagination
          className="text-center mt-4"
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredCourses.length}
          onChange={handlePageChange}
        />
      </motion.div>
    </UserLayout>
  );
}

export default Course;
