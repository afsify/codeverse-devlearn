import { Routes, Route } from "react-router-dom";
import { adminPath } from "./routeConfig";
import Signin from "../pages/admin/Signin";
import Meeting from "../pages/admin/Meeting";
import Feedback from "../pages/admin/Feedback";
import Settings from "../pages/admin/Settings";
import NotFound from "../pages/error/NotFound";
import Dashboard from "../pages/admin/Dashboard";
import UserManage from "../pages/admin/UserManage";
import ServerError from "../pages/error/ServerError";
import CourseManage from "../pages/admin/CourseManage";
import BannerManage from "../pages/admin/BannerManage";
import ServiceManage from "../pages/admin/ServiceManage";
import ProjectManage from "../pages/admin/ProjectManage";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";

function AdminRoute() {
  return (
    <Routes>
    <Route element={<PublicRoute role={"admin"} route={`/admin/${adminPath.dashboard}`} />}>
      <Route path={adminPath.signin} element={<Signin />} />
    </Route>
    <Route element={<PrivateRoute role={"admin"} route={`/admin/${adminPath.signin}`} />}>
      <Route path="/*" element={<NotFound />} />
      <Route path="error" element={<ServerError />} />
      <Route path={adminPath.meeting} element={<Meeting />} />
      <Route path={adminPath.feedback} element={<Feedback />} />
      <Route path={adminPath.settings} element={<Settings />} />
      <Route path={adminPath.dashboard} element={<Dashboard />} />
      <Route path={adminPath.userManage} element={<UserManage />} />
      <Route path={adminPath.courseManage} element={<CourseManage />} />
      <Route path={adminPath.bannerManage} element={<BannerManage />} />
      <Route path={adminPath.serviceManage} element={<ServiceManage />} />
      <Route path={adminPath.projectManage} element={<ProjectManage />} />
    </Route>
  </Routes>
  );
}

export default AdminRoute;
