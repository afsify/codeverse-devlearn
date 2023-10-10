import { Button, Form, Input } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { otpCheck } from "../../api/services/userService";
import AuthCard from "../../components/auth/AuthCard";
import { userPath } from "../../routes/routeConfig";

function CheckOTP() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email } = location.state || {};

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await otpCheck(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(userPath.resetPassword, { state: { email: response.data.Email } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthCard>
      <h2 className="font-bold text-3xl text-dark-purple">Verification</h2>
      <p className="text-sm mt-5 text-dark-purple">
        OTP has been sent via email to{" "}
        <span className="font-semibold">{email}</span>
      </p>
      <Form className="flex flex-col mt-3" onFinish={onFinish}>
        <Form.Item name="otp">
          <label className="relative cursor-pointer">
            <Input
              placeholder="OTP"
              className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
            />
            <span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
              OTP
            </span>
          </label>
        </Form.Item>
        <Button
          size="large"
          className="text-white font-semibold hover:scale-105 duration-300"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form>
      <div className="mt-3 text-sm flex justify-center items-center text-dark-purple py-4">
        <p>OTP not received?</p>
        <Link
          to={userPath.forgotPassword}
          className="pl-1 text-blue-900 font-semibold hover:text-blue-500 hover:underline"
        >
          Forgot Password
        </Link>
      </div>
    </AuthCard>
  );
}

export default CheckOTP;
