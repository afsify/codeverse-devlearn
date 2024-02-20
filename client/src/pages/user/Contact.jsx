import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { Button, Form, Input, Typography } from "antd";
import VerifiedIcon from "@mui/icons-material/Verified";
import UserLayout from "../../components/layout/UserLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { contactMessage, primePayment } from "../../api/services/userService";
import {
  CrownFilled,
  PhoneFilled,
  SendOutlined,
  WechatFilled,
  VideoCameraFilled,
} from "@ant-design/icons";

const { Title } = Typography;

function Contact() {
  const dispatch = useDispatch();
  const encodedUserData = localStorage.getItem("userData");
  const userData = encodedUserData ? JSON.parse(atob(encodedUserData)) : null;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await contactMessage(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handlePaymentSuccess = async (token, subscription) => {
    try {
      dispatch(showLoading());
      const values = { token, subscription };
      const response = await primePayment(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={fadeInUp}
            className="p-5 shadow-sm shadow-black rounded-lg"
          >
            <Title className="mb-2" level={2}>
              Contact Us
            </Title>
            <p className="text-gray-500 mb-4">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you need
              assistance, have feedback, or anything else, feel free to reach
              out to us using the contact form. We&apos;re here to help!
            </p>
            <Form name="contact-form" onFinish={onFinish} layout="vertical">
              <Form.Item
                name="name"
                label="Your Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name!",
                  },
                ]}
              >
                <Input className="py-2" placeholder="Your Name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                  {
                    required: true,
                    message: "Please enter your email address!",
                  },
                ]}
              >
                <Input className="py-2" placeholder="Email Address" />
              </Form.Item>
              <Form.Item
                name="message"
                label="Your Message"
                rules={[
                  {
                    required: true,
                    message: "Please enter your message!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Your Message" rows={4} />
              </Form.Item>
              <Form.Item>
                <Button
                  className="flex justify-center items-center"
                  size="large"
                  style={{ color: "white" }}
                  htmlType="submit"
                  icon={<SendOutlined />}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="p-5 shadow-sm shadow-black rounded-lg"
          >
            <Title className="mb-2" level={2}>
              Prime Plans
            </Title>
            <p className="text-gray-500 mb-5">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Discover the
              benefits of our Prime Plans, providing you with exclusive access
              to premium content, personalized tech support, engaging live
              meetings, and participation in an exclusive tech support group.
            </p>
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-md transition duration-300">
                <CrownFilled
                  style={{ color: "gold" }}
                  className="mr-2 font-semibold"
                />
                <span className="font-semibold">Access to premium</span>
              </div>
              <div className="flex items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-md transition duration-300">
                <PhoneFilled
                  style={{ color: "#005aab" }}
                  className="mr-2 font-semibold"
                />
                <span className="font-semibold">Personal tech support</span>
              </div>
              <div className="flex items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-md transition duration-300">
                <VideoCameraFilled
                  style={{ color: "#f9203d" }}
                  className="mr-2 font-semibold"
                />
                <span className="font-semibold">Live meeting sessions</span>
              </div>
              <div className="flex items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-md transition duration-300">
                <WechatFilled
                  style={{ color: "green" }}
                  className="mr-2 font-semibold"
                />
                <span className="font-semibold">Tech support group</span>
              </div>
              <div className="flex items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-md transition duration-300">
                <VerifiedIcon
                  className="mr-2"
                  color="primary"
                  sx={{ fontSize: 18 }}
                />
                <span className="font-semibold">Member Recognition</span>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex justify-around">
              {userData?.prime ? (
                <div className="text-center mt-6">
                  <Button size="large" disabled>
                    Subscribed
                  </Button>
                </div>
              ) : (
                <div className="text-center mt-6">
                  <StripeCheckout
                    token={(token) => handlePaymentSuccess(token, "monthly")}
                    stripeKey={import.meta.env.VITE_STRIPE_KEY}
                    name="Monthly Subscription"
                    amount={9900}
                    currency="INR"
                    locale="auto"
                  >
                    <Button size="large">Monthly ₹99</Button>
                  </StripeCheckout>
                </div>
              )}
              {userData?.prime ? null : (
                <div className="text-center mt-6">
                  <StripeCheckout
                    token={(token) => handlePaymentSuccess(token, "yearly")}
                    stripeKey={import.meta.env.VITE_STRIPE_KEY}
                    name="Yearly Subscription"
                    amount={99900}
                    currency="INR"
                    locale="auto"
                  >
                    <Button size="large">Yearly ₹999</Button>
                  </StripeCheckout>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </UserLayout>
  );
}

export default Contact;
