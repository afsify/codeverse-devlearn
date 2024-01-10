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
const DevHub = lazy(() => import("../pages/user/DevHub"));
const Service = lazy(() => import("../pages/user/Service"));
const Contact = lazy(() => import("../pages/user/Contact"));
const Library = lazy(() => import("../pages/user/Library"));
const Profile = lazy(() => import("../pages/user/Profile"));
const Discover = lazy(() => import("../pages/user/Discover"));
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
      <Route path={userPath.devhub} element={<DevHub />} />
      <Route path={userPath.service} element={<Service />} />
      <Route path={userPath.contact} element={<Contact />} />
      <Route path={userPath.discover} element={<Discover />} />
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative h-24 w-24">
            <div className="rounded-full h-24 w-24 border-t-4 border-t-blue-500 animate-spin absolute"></div>
            <div className="h-full w-full flex justify-center items-center">
              <h1 className="text-blue-500 text-3xl font-mono font-extrabold">
                &lt;/&gt;
              </h1>
            </div>
          </div>
        </div>
      }
    >
      <UserRoute />
    </Suspense>
  );
}
