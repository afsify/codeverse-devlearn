import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { getUser, sendOtp, verifyOtp } from "../../api/services/userService";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import AuthCard from "../../components/auth/AuthCard";
import { userActions } from "../../utils/userSlice";
import { userPath } from "../../routes/routeConfig";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await sendOtp(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(userPath.otp, { state: { email: response.data.Email } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const responseMessage = async (response) => {
    try {
      let credential = jwt_decode(response.credential);
      const values = {
        name: credential.name,
        email: credential.email,
        password: credential.sub,
        exp: credential.exp,
      };
      const loginResponse = await verifyOtp(values);
      if (loginResponse.data.success) {
        toast.success(loginResponse.data.message);
        localStorage.setItem("userToken", loginResponse.data.token);
        dispatch(userActions.userLogin());
        const userResponse = await getUser();
        const encodedUserData = btoa(
          JSON.stringify(userResponse.data.userData)
        );
        localStorage.setItem("userData", encodedUserData);
        navigate(userPath.home);
      } else {
        toast.error(loginResponse.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const validatePassword = (_, value) => {
    const passwordFieldValue = form.getFieldValue("password");

    if (passwordFieldValue === value) {
      return Promise.resolve();
    }

    return Promise.reject("Passwords do not match");
  };

  const [form] = Form.useForm();

  return (
    <AuthCard>
      <h2 className="font-bold text-3xl text-dark-purple">Register</h2>
      <p className="text-sm mt-3 text-dark-purple">
        Create your free account and get started
      </p>
      <Form className="flex flex-col mt-3" onFinish={onFinish} form={form}>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter your name",
            },
            {
              pattern: /^(?=.*[A-Za-z])[\s\S]*$/,
              message: "Name cannot be empty",
            },
          ]}
        >
          <label className="relative cursor-pointer">
            <Input
              placeholder="Name"
              className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
            />
            <span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
              Name
            </span>
          </label>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
              type: "email",
            },
          ]}
        >
          <label className="relative cursor-pointer">
            <Input
              placeholder="Email"
              className="p-2 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
            />
            <span className="text-opacity-80 bg-white absolute left-2 top-0 px-1 transition text-gray-400 duration-200 input-text">
              Email
            </span>
          </label>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Need 8-20 characters, one symbol & number",
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
            },
          ]}
        >
          <Input.Password placeholder="Password" className="p-2" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="Confirm Password" className="p-2" />
        </Form.Item>
        <Button
          size="large"
          className="text-white font-semibold hover:scale-105 duration-300"
          htmlType="submit"
        >
          Register
        </Button>
      </Form>

      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-gray-400" />
        <p className="text-center text-sm">OR</p>
        <hr className="border-gray-400" />
      </div>

      <div className="flex justify-center items-center mt-5">
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>

      <div className="mt-5 text-sm flex justify-center items-center text-dark-purple">
        <p>Already have an account?</p>
        <Link
          to={userPath.login}
          className="pl-1 text-blue-900 font-semibold hover:text-blue-500 hover:underline"
        >
          Login
        </Link>
      </div>
    </AuthCard>
  );
}

export default Register;
