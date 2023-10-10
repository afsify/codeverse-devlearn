import { useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import { Button, Collapse, List, Space } from "antd";
import {
  PhoneOutlined,
  VideoCameraOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import StripeCheckout from "react-stripe-checkout";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { primePayment } from "../../api/services/userService";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

function Contact() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);

  const encodedUserData = localStorage.getItem("userData");
  const userData = encodedUserData ? JSON.parse(atob(encodedUserData)) : null;

  const toggleSubscriptionDetails = () => {
    setShowSubscriptionDetails(!showSubscriptionDetails);
  };

  const handlePaymentSuccess = async (token) => {
    try {
      dispatch(showLoading());
      const response = await primePayment(token);
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
      <div className="container mx-auto mt-10 p-4">
        <div className="flex justify-center mb-6 md:mb-8">
          <Button
            className="flex justify-center items-center"
            size="large"
            onClick={toggleSubscriptionDetails}
          >
            <TeamOutlined />
            Show Subscription Details
          </Button>
        </div>
        <Collapse
          accordion
          activeKey={showSubscriptionDetails ? ["1"] : []}
          onChange={toggleSubscriptionDetails}
        >
          <Panel header="Prime Membership Subscription" key="1">
            <List
              size="large"
              bordered
              dataSource={[
                "Access to premium content",
                "Group chat discussion",
                "Personal tech support",
                "Video conference",
                "₹399/- only",
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
            {userData.prime ? null : (
              <div className="text-center mt-6">
                <StripeCheckout
                  token={(token) => handlePaymentSuccess(token, "prime")}
                  stripeKey="pk_test_51Nur8FSJ8OurP7wvqFPgtEkXYWJliqky8VWh3A0Kzznw4YpAxhl8qR6t1jjTvOXcALoGYqBiaq5DSyEBG5E6tpZg00nRk58HP7"
                  name="Prime Membership"
                  amount={39900}
                  currency="INR"
                  locale="auto"
                >
                  <Button size="large">Subscribe Now</Button>
                </StripeCheckout>
              </div>
            )}
          </Panel>
        </Collapse>
        <div className="mt-10">
          <h2 className="text-3xl mb-4">Contact Options</h2>
          <Space
            direction="vertical"
            size="large"
            className="text-center md:text-left"
          >
            <Button
              className="flex justify-center items-center"
              size="large"
              block
            >
              <PhoneOutlined />
              Tech Support
            </Button>
            <Button
              className="flex justify-center items-center"
              size="large"
              block
            >
              <VideoCameraOutlined />
              Meeting Session
            </Button>
            <Button
              className="flex justify-center items-center"
              size="large"
              block
            >
              <TeamOutlined />
              Group Chat
            </Button>
          </Space>
        </div>
      </div>
      {userData.prime ? (
        <div className="bg-gradient-to-t from-blue-500 to-transparent h-32 flex justify-center items-center fixed bottom-0 left-0 w-full">
          <Button
            size="large"
            className="font-semibold w-48 hover:scale-105 transition duration-300"
            onClick={() => navigate()}
          >
            Join Meeting
          </Button>
        </div>
      ) : null}
    </UserLayout>
  );
}

export default Contact;
