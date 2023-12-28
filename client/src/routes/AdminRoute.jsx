import { Spin } from "antd";
import { lazy, Suspense } from "react";
import { adminPath } from "./routeConfig";
import NotFound from "../pages/error/NotFound";
import { Routes, Route } from "react-router-dom";
import ServerError from "../pages/error/ServerError";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";

const Signin = lazy(() => import("../pages/admin/Signin"));
const Meeting = lazy(() => import("../pages/admin/Meeting"));
const Feedback = lazy(() => import("../pages/admin/Feedback"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const UserManage = lazy(() => import("../pages/admin/UserManage"));
const CourseManage = lazy(() => import("../pages/admin/CourseManage"));
const BannerManage = lazy(() => import("../pages/admin/BannerManage"));
const ServiceManage = lazy(() => import("../pages/admin/ServiceManage"));
const ProjectManage = lazy(() => import("../pages/admin/ProjectManage"));

function AdminRoute() {
  return (
    <Routes>
      <Route
        element={
          <PublicRoute role={"admin"} route={`/admin/${adminPath.dashboard}`} />
        }
      >
        <Route path={adminPath.signin} element={<Signin />} />
      </Route>
      <Route
        element={
          <PrivateRoute role={"admin"} route={`/admin/${adminPath.signin}`} />
        }
      >
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

export default function AdminRouteWithSuspense() {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          className="flex h-screen justify-center items-center"
        />
      }
    >
      <AdminRoute />
    </Suspense>
  );
}
