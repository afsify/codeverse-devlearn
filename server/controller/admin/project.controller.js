const projectModel = require("../../model/project.model");

//! ============================================== List Project ==============================================

const listProject = async (req, res, next) => {
  try {
    const projects = await projectModel.find({});
    res.status(200).json({
      message: "Projects Fetched",
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== Add Project ===============================================

const insertProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      category,
      github,
      youtube,
      live,
      image,
    } = req.body;
    const projectExists = await projectModel.findOne({ title: req.body.title });
    if (projectExists) {
      return res
        .status(200)
        .json({ message: "Project Already Exists", success: false });
    }
    const newProject = new projectModel({
      title,
      description,
      status,
      category,
      github,
      youtube,
      live,
      image,
    });
    const savedProject = await newProject.save();
    res.status(200).json({
      message: "Project Created",
      success: true,
      data: savedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Edit Project ==============================================

const editProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      category,
      github,
      youtube,
      live,
      image,
    } = req.body;
    const projectId = req.params.projectId;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not Found" });
    }
    project.title = title;
    project.description = description;
    project.status = status;
    project.category = category;
    project.github = github;
    project.youtube = youtube;
    project.live = live;
    project.image = image;
    const savedProject = await project.save();
    res
      .status(200)
      .json({ success: true, message: "Project Updated", data: savedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Project Status ==============================================

const projectStatus = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not Found" });
    }
    project.status = !project.status;
    const savedBanner = await project.save();
    res
      .status(200)
      .json({ success: true, message: "Status Updated", data: savedBanner });
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

//! ============================================== Delete Project ==============================================

const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await projectModel.findOneAndDelete({ _id: projectId });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not Found" });
    }
    res.status(200).json({ success: true, message: "Project Deleted" });
  } catch (error) {
    next(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

module.exports = {
  listProject,
  insertProject,
  editProject,
  projectStatus,
  deleteProject,
};
