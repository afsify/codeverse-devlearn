import { useState, useEffect } from "react";
import UserLayout from "../../components/layout/UserLayout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { createOrder, listCourse } from "../../api/services/userService";
import StripeCheckout from "react-stripe-checkout";
import { Button } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userPath } from "../../routes/routeConfig";

function Course() {
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <UserLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-32 p-2">
        {courses.map((course) => (
          <div
            key={course._id}
            className="col-span-1 transform hover:scale-105 hover:shadow-xl transition duration-300"
          >
            <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer">
              <img
                alt={course.title}
                src={course.image}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>

                <StripeCheckout
                  token={(token) => handlePaymentSuccess(token, course)}
                  stripeKey="pk_test_51Nur8FSJ8OurP7wvqFPgtEkXYWJliqky8VWh3A0Kzznw4YpAxhl8qR6t1jjTvOXcALoGYqBiaq5DSyEBG5E6tpZg00nRk58HP7"
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
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-t from-blue-500 to-transparent h-32 flex justify-center items-center fixed bottom-0 left-0 w-full">
        <Button
          size="large"
          className="font-semibold w-48 hover:scale-105 transition duration-300"
          onClick={() => navigate(userPath.library)}
        >
          Library
        </Button>
      </div>
    </UserLayout>
  );
}

export default Course;
