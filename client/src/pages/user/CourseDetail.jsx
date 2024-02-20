import { Button, Typography } from "antd";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import UserLayout from "../../components/layout/UserLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { PlayCircleOutlined, LockOutlined } from "@ant-design/icons";
import {
  listOrder,
  getCourse,
  createOrder,
} from "../../api/services/userService";
import { motion } from "framer-motion";

const { Title } = Typography;

function CourseDetail() {
  const dispatch = useDispatch();
  const location = useLocation();
  const courseId = location?.state.course._id;
  const [course, setCourse] = useState(null);
  const [isPlaying, setPlaying] = useState(true);
  const [userOrders, setUserOrders] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          dispatch(showLoading());
          const response = await getCourse(courseId);
          dispatch(hideLoading());
          const courseData = response.data.data;
          setCourse(courseData);
        } catch (error) {
          dispatch(hideLoading());
          console.error("Error fetching course:", error);
          setCourse(null);
        }
      };

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

      fetchCourse();
      fetchUserOrders();
    }
  }, [courseId, dispatch]);

  const isCoursePurchased = userOrders.some(
    (order) => order.courseId === courseId
  );

  const purchasedOrderData = userOrders.find(
    (order) => order.courseId === courseId
  );

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

  const handleVideoClick = (videoUrl) => {
    if (selectedVideo === videoUrl) {
      setPlaying(!isPlaying);
    } else {
      setSelectedVideo(videoUrl);
      setPlaying(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <UserLayout>
      {course && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="shadow-md rounded-lg px-4 pt-1"
        >
          {selectedVideo ? (
            <div className="flex justify-center w-full h-full">
              <ReactPlayer
                url={selectedVideo}
                controls
                width="65%"
                height="65%"
                playing={isPlaying}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            </div>
          ) : (
            <div className="relative w-full h-40 sm:h-80 md:h-[450px]">
              <img
                alt={course.title}
                src={course.image}
                className="w-full h-full object-cover rounded-lg mb-4"
              />
            </div>
          )}
          <Title className="mt-5" level={2}>
            {course.title}
          </Title>
          <p className="text-gray-500 mb-2">{course.description}</p>
          <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-3">
            {course.preview && (
              <div className="mt-2 sm:mt-0">
                <motion.span
                  onClick={() => handleVideoClick(course.preview)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group overflow-hidden cursor-pointer rounded-md hover:shadow-md transition duration-300"
                >
                  <div className="relative">
                    <img
                      src={course.image}
                      alt="Video Thumbnail"
                      className="w-full h-24 object-cover rounded-lg transition duration-300 group-hover:opacity-75 relative"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-20 transition duration-300 group-hover:bg-opacity-75">
                      <PlayCircleOutlined className="text-white text-4xl opacity-40 group-hover:opacity-100 transition duration-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-2">
                    <p className="text-white text-xs font-semibold font-sans group-hover:underline">
                      Preview
                    </p>
                  </div>
                </motion.span>
              </div>
            )}
            {isCoursePurchased ? (
              <Button
                size="large"
                className="w-44 mt-4 sm:mt-0 font-semibold"
                disabled
              >
                Purchased
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
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
                    style={{ color: "white" }}
                    className="w-44 mt-4 sm:mt-0 font-semibold"
                    htmlType="submit"
                  >
                    Buy Now - ₹{course.price}
                  </Button>
                </StripeCheckout>
              </motion.div>
            )}
          </div>
          <div className="mt-4 border-t">
            <Title className="mt-4" level={3}>
              Videos
            </Title>
            {isCoursePurchased ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-32 pt-2 pb-4">
                {purchasedOrderData.videos.map((video, index) => (
                  <motion.div
                    className="col-span-1 transform hover:scale-105 hover:shadow-xl transition duration-300 relative"
                    key={index}
                  >
                    <motion.span
                      onClick={() => handleVideoClick(video)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="relative group overflow-hidden cursor-pointer rounded-md hover:shadow-md transition duration-300"
                    >
                      <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer">
                        <img
                          src={course.image}
                          alt={`Video Thumbnail ${index + 1}`}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-20 transition duration-300 group-hover:bg-opacity-75">
                          <PlayCircleOutlined className="text-white text-6xl opacity-40 group-hover:opacity-100 transition duration-300" />
                        </div>
                        <h3 className="text-lg font-sans font-semibold pl-3">
                          Video {index + 1}
                        </h3>
                      </div>
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-32 pt-2 pb-4">
                {Array.from({ length: course.count }, (_, index) => (
                  <motion.div
                    className="col-span-1 transform relative"
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                      <img
                        src={course.image}
                        alt={`Dummy Video Thumbnail ${index + 1}`}
                        className="w-full h-44 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-40">
                        <LockOutlined className="text-white text-6xl hover:scale-110 transition duration-300" />
                      </div>
                      <p className="text-white text-xs font-semibold font-sans absolute bottom-0 left-0 w-full p-2">
                        Video {index + 1}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </UserLayout>
  );
}

export default CourseDetail;
