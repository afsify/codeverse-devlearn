import { Spin } from "antd";
import { lazy, Suspense } from "react";
import { userPath } from "./routeConfig";
import NotFound from "../pages/error/NotFound";
import { Routes, Route } from "react-router-dom";
import ServerError from "../pages/error/ServerError";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";

const Home = lazy(() => import("../pages/user/Home"));
const Login = lazy(() => import("../pages/user/Login"));
const About = lazy(() => import("../pages/user/About"));
const Course = lazy(() => import("../pages/user/Course"));
const Service = lazy(() => import("../pages/user/Service"));
const Contact = lazy(() => import("../pages/user/Contact"));
const Library = lazy(() => import("../pages/user/Library"));
const Profile = lazy(() => import("../pages/user/Profile"));
const Register = lazy(() => import("../pages/user/Register"));
const Messages = lazy(() => import("../pages/user/Messages"));
const ResetOTP = lazy(() => import("../pages/user/ResetOTP"));
const RegisterOTP = lazy(() => import("../pages/user/RegisterOTP"));
const ResetPassword = lazy(() => import("../pages/user/ResetPassword"));
const ForgotPassword = lazy(() => import("../pages/user/ForgotPassword"));
const CourseDetail = lazy(() => import("../pages/user/CourseDetail"));

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
      <Route path="/*" element={<NotFound />} />
      <Route path="error" element={<ServerError />} />
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

export default function UserRouteWithSuspense() {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          className="flex h-screen justify-center items-center"
        />
      }
    >
      <UserRoute />
    </Suspense>
  );
}
