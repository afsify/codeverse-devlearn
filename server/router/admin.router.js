const express = require("express");
const admin_router = express.Router();
const adminController = require("../controller/admin.controller");
const bannerController = require("../controller/banner.controller");
const serviceController = require("../controller/service.controller");
const projectController = require("../controller/project.controller");
const { adminAuth } = require("../middleware/auth");

//? ============================================= Authorization =============================================

admin_router.post("/signin", adminController.signin);
admin_router.get("/get-admin", adminAuth, adminController.getAdmin);

//? ============================================== Dashboard ==============================================

admin_router.get("/list-dashboard", adminAuth, adminController.listDashboard);

//? ============================================== User Manage ==============================================

admin_router.get("/list-user", adminAuth, adminController.listUser);
admin_router.post("/block-user/:userId", adminAuth, adminController.blockUser);
admin_router.post("/unblock-user/:userId", adminAuth, adminController.unblockUser);

//? ============================================= Banner Manage =============================================

admin_router.get("/list-banner", adminAuth, bannerController.listBanner);
admin_router.post("/insert-banner", adminAuth, bannerController.insertBanner);
admin_router.post("/edit-banner/:bannerId", adminAuth, bannerController.editBanner);
admin_router.post("/banner-status/:bannerId", adminAuth, bannerController.bannerStatus);
admin_router.delete("/delete-banner/:bannerId", adminAuth, bannerController.deleteBanner);

//? ============================================= Service Manage =============================================

admin_router.get("/list-service", adminAuth, serviceController.listService);
admin_router.post("/insert-service", adminAuth, serviceController.insertService);
admin_router.post("/edit-service/:serviceId", adminAuth, serviceController.editService);
admin_router.post("/service-status/:serviceId", adminAuth, serviceController.serviceStatus);
admin_router.delete("/delete-service/:serviceId", adminAuth, serviceController.deleteService);

//? ============================================= Project Manage =============================================

admin_router.get("/list-project", adminAuth, projectController.listProject);
admin_router.post("/insert-project", adminAuth, projectController.insertProject);
admin_router.post("/edit-project/:projectId", adminAuth, projectController.editProject);
admin_router.post("/project-status/:projectId", adminAuth, projectController.projectStatus);
admin_router.delete("/delete-project/:projectId", adminAuth, projectController.deleteProject);

//? ============================================= Course Manage =============================================

admin_router.get("/list-course", adminAuth, adminController.listCourse);
admin_router.post("/insert-course", adminAuth, adminController.insertCourse);
admin_router.post("/edit-course/:courseId", adminAuth, adminController.editCourse);
admin_router.delete("/delete-course/:courseId", adminAuth, adminController.deleteCourse);

//? ================================================ Settings ================================================

admin_router.put("/update-about/:adminId", adminAuth, adminController.updateAbout);

module.exports = admin_router;
