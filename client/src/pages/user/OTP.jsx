import { useState, useRef, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { verifyOtp } from "../../api/services/userService";
import AuthCard from "../../components/auth/AuthCard";
import { userPath } from "../../routes/routeConfig";

function OTP() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email } = location.state || {};

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (/^\d+$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "" && index >= 0) {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split("").slice(0, 6);
      setOtpValues(newOtpValues);
      newOtpValues.forEach((value, index) => {
        inputRefs.current[index].value = value;
      });
    }
  };

  const onFinish = async () => {
    try {
      dispatch(showLoading());
      const otp = otpValues.join("");
      const response = await verifyOtp({ otp });
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

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  return (
    <AuthCard>
      <h2 className="font-bold text-3xl text-dark-purple">Verification</h2>
      <p className="text-sm mt-3 text-dark-purple">
        OTP has been sent via email to{" "}
        <span className="font-semibold">{email}</span>
      </p>
      <Form className="flex flex-col mt-3" onFinish={onFinish}>
        <div className="flex">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Form.Item key={index} style={{ margin: "0 4px" }}>
              <Input
                type="text"
                className="p-2"
                style={{ width: "40px", textAlign: "center" }}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                onPaste={handlePaste}
                value={otpValues[index]}
                ref={(input) => (inputRefs.current[index] = input)}
              />
            </Form.Item>
          ))}
        </div>
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
          to={userPath.register}
          className="pl-1 text-blue-900 font-semibold hover:text-blue-500 hover:underline"
        >
          Register
        </Link>
      </div>
    </AuthCard>
  );
}

export default OTP;
