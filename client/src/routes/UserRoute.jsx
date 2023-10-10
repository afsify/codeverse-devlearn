import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/auth/PrivateRoute";
import PublicRoute from "../components/auth/PublicRoute";
import Register from "../pages/user/Register";
import OTP from "../pages/user/OTP";
import Login from "../pages/user/Login";
import ForgotPassword from "../pages/user/ForgotPassword";
import ResetPassword from "../pages/user/ResetPassword";
import CheckOTP from "../pages/user/CheckOTP";
import Home from "../pages/user/Home";
import Service from "../pages/user/Service";
import Course from "../pages/user/Course";
import Library from "../pages/user/Library";
import Contact from "../pages/user/Contact";
import About from "../pages/user/About";
import Profile from "../pages/user/Profile";
import { userPath } from "./routeConfig";

function UserRoute() {
  return (
    <Routes>
      <Route element={<PublicRoute role={"user"} route={userPath.home} />}>
        <Route path={userPath.register} element={<Register />} />
        <Route path={userPath.otp} element={<OTP />} />
        <Route path={userPath.login} element={<Login />} />
        <Route path={userPath.forgotPassword} element={<ForgotPassword />} />
        <Route path={userPath.checkOTP} element={<CheckOTP />} />
        <Route path={userPath.resetPassword} element={<ResetPassword />} />
      </Route>
      <Route path={userPath.home} element={<Home />} />
      <Route path={userPath.service} element={<Service />} />
      <Route path={userPath.course} element={<Course />} />
      <Route path={userPath.contact} element={<Contact />} />
      <Route path={userPath.about} element={<About />} />
      <Route element={<PrivateRoute role={"user"} route={userPath.home} />}>
        <Route path={userPath.library} element={<Library />} />
        <Route path={userPath.profile} element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default UserRoute;
