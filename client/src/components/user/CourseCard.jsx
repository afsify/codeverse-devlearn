import { Button } from "antd";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { userPath } from "../../routes/routeConfig";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  listOrder,
  createOrder,
  topCourse,
} from "../../api/services/userService";
import Skeleton from "./Skeleton";

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
    <>
      <div className="flex md:justify-between md:flex-row flex-col mb-6 mt-8 px-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          Trending Courses
        </h1>
        <Button
          onClick={() => navigate(userPath.course)}
          style={{
            backgroundColor: "#FFFFFF",
            color: "#000000",
          }}
          size="large"
          className="my-3  md:my-0 font-semibold"
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
                  <div className="bg-white shadow-md rounded-lg hover:scale-105 hover:shadow-xl duration-300 overflow-hidden cursor-pointer">
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
                    <div className="p-4">
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
                        className="text-gray-600 cursor-pointer"
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
                            className="mt-5 w-full font-semibold"
                            htmlType="submit"
                          >
                            ₹{course.price}
                          </Button>
                        </StripeCheckout>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
      </div>
    </>
  );
}

export default CourseCard;
