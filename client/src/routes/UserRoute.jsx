import { userPath } from "./routeConfig";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import Login from "../pages/user/Login";
import About from "../pages/user/About";
import Course from "../pages/user/Course";
import Service from "../pages/user/Service";
import Contact from "../pages/user/Contact";
import Library from "../pages/user/Library";
import Profile from "../pages/user/Profile";
import Register from "../pages/user/Register";
import Messages from "../pages/user/Messages";
import ResetOTP from "../pages/user/ResetOTP";
import RegisterOTP from "../pages/user/RegisterOTP";
import CourseDetail from "../pages/user/CourseDetail";
import ResetPassword from "../pages/user/ResetPassword";
import ForgotPassword from "../pages/user/ForgotPassword";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";

function UserRoute() {
  return (
    <Routes>
      <Route element={<PublicRoute role={"user"} route={userPath.home} />}>
        <Route path={userPath.login} element={<Login />} />
        <Route path={userPath.resetOTP} element={<ResetOTP />} />
        <Route path={userPath.register} element={<Register />} />
        <Route path={userPath.registerOTP} element={<RegisterOTP />} />
        <Route path={userPath.resetPassword} element={<ResetPassword />} />
        <Route path={userPath.forgotPassword} element={<ForgotPassword />} />
      </Route>
      <Route path={userPath.home} element={<Home />} />
      <Route path={userPath.about} element={<About />} />
      <Route path={userPath.course} element={<Course />} />
      <Route path={userPath.service} element={<Service />} />
      <Route path={userPath.contact} element={<Contact />} />
      <Route path={userPath.courseDetail} element={<CourseDetail />} />
      <Route element={<PrivateRoute role={"user"} route={userPath.home} />}>
        <Route path={userPath.library} element={<Library />} />
        <Route path={userPath.profile} element={<Profile />} />
        <Route path={userPath.messages} element={<Messages />} />
      </Route>
    </Routes>
  );
}

export default UserRoute;
