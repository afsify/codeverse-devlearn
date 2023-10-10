import { Routes, Route } from "react-router-dom";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";
import Signin from "../pages/admin/Signin";
import Dashboard from "../pages/admin/Dashboard";
import UserManage from "../pages/admin/UserManage";
import BannerManage from "../pages/admin/BannerManage";
import ServiceManage from "../pages/admin/ServiceManage";
import CourseManage from "../pages/admin/CourseManage";
import ProjectManage from "../pages/admin/ProjectManage";
import Settings from "../pages/admin/Settings";
import MessageSession from "../pages/admin/MessageSession";
import Meeting from "../pages/admin/Meeting";
import { adminPath } from "./routeConfig";

function AdminRoute() {
  return (
    <Routes>
    <Route element={<PublicRoute role={"admin"} route={`/admin/${adminPath.dashboard}`} />}>
      <Route path={adminPath.signin} element={<Signin />} />
    </Route>
    <Route element={<PrivateRoute role={"admin"} route={`/admin/${adminPath.signin}`} />}>
      <Route path={adminPath.dashboard} element={<Dashboard />} />
      <Route path={adminPath.userManage} element={<UserManage />} />
      <Route path={adminPath.bannerManage} element={<BannerManage />} />
      <Route path={adminPath.serviceManage} element={<ServiceManage />} />
      <Route path={adminPath.courseManage} element={<CourseManage />} />
      <Route path={adminPath.projectManage} element={<ProjectManage />} />
      <Route path={adminPath.settings} element={<Settings />} />
      <Route path={adminPath.messageSession} element={<MessageSession />} />
      <Route path={adminPath.meeting} element={<Meeting />} />
    </Route>
  </Routes>
  );
}

export default AdminRoute;
