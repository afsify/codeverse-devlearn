import { Button, Form, Input } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../utils/alertSlice";
import { resetPassword } from "../../api/services/userService";
import AuthCard from "../../components/auth/AuthCard";
import { userPath } from "../../routes/routeConfig";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email } = location.state || {};

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await resetPassword(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(userPath.login);
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
      <h2 className="font-bold text-3xl text-dark-purple">Reset Password</h2>
      <p className="text-sm mt-3 text-dark-purple">
        Set your new password for <span className="font-semibold">{email}</span>
      </p>
      <Form className="flex flex-col" onFinish={onFinish}>
        <Form.Item className="hidden" name="email" initialValue={email}>
          <Input type="email" />
        </Form.Item>
        <Form.Item className="mt-3" name="password">
          <label className="relative cursor-pointer">
            <Input
              placeholder="New Password"
              className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
            />
            <span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
              New Password
            </span>
          </label>
        </Form.Item>
        <Form.Item name="confirm-password">
          <label className="relative cursor-pointer">
            <Input
              placeholder="Confirm Password"
              className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
            />
            <span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
              Confirm Password
            </span>
          </label>
        </Form.Item>
        <Button
          size="large"
          className="text-white font-semibold hover:scale-105 duration-300"
          htmlType="submit"
        >
          Update
        </Button>
      </Form>
      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-gray-400" />
        <p className="text-center text-sm">OR</p>
        <hr className="border-gray-400" />
      </div>
      <div className="mt-3 text-sm flex justify-center items-center text-dark-purple py-4">
        <p>Don't have an account?</p>
        <Link
          to={userPath.register}
          className="pl-1 text-blue-900 font-semibold hover:text-blue-500 hover:underline"
        >
          Register
        </Link>
      </div>
    </AuthCard>
  );
}

export default ResetPassword;
