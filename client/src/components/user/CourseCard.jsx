import Skeleton from "./Skeleton";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "antd";
import StripeCheckout from "react-stripe-checkout";
import { userPath } from "../../routes/routeConfig";
import { useState, useEffect, Fragment } from "react";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  listOrder,
  createOrder,
  topCourse,
} from "../../api/services/userService";

const { Title } = Typography;

function CourseCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await topCourse();
        const courseData = response.data.data;
        setCourses(courseData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        fetchCourses();
      }
    };
    fetchCourses();
  }, [dispatch]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await listOrder();
        const userOrderData = response.data.data;
        setUserOrders(userOrderData);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        setUserOrders([]);
      }
    };
    fetchUserOrders();
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Fragment>
      <div className="flex md:justify-between md:flex-row flex-col mb-6 mt-8 px-4">
        <Title level={2}>Trending Courses</Title>
        <Button
          onClick={() => navigate(userPath.course)}
          style={{
            backgroundColor: "transparent",
          }}
          size="large"
          className="my-3 md:my-0 font-semibold"
        >
          More Courses
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-md transition duration-300 ease-in-out"
              >
                <Skeleton type="image" count={1} width={100} height={40} />
                <div className="px-6 py-4">
                  <div className="w-1/2 mb-3">
                    <Skeleton type="text" count={1} />
                  </div>
                  <div className="mb-4">
                    <Skeleton type="text" count={1} />
                    <Skeleton type="text" count={1} />
                    <Skeleton type="text" count={1} />
                  </div>
                  <div className="h-10 rounded-lg mt-5 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            ))
          : courses.map((course, index) => (
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
                    {userOrders.some(
                      (order) => order.courseId === course._id
                    ) ? (
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
                          style={{
                            backgroundColor: "transparent",
                          }}
                          className="mt-5 w-full font-semibold"
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
    </Fragment>
  );
}

export default CourseCard;
