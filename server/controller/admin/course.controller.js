const courseModel = require("../../model/course.model");

//! ============================================== List Course ==============================================

const listCourse = async (req, res, next) => {
  try {
    const courses = await courseModel.find({});
    res.status(200).json({
      message: "Courses Fetched",
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== Add Course ===============================================

const insertCourse = async (req, res, next) => {
  try {
    const { title, description, price, status, image, preview, videos } =
      req.body;
    const courseExists = await courseModel.findOne({ title: req.body.title });
    if (courseExists) {
      return res
        .status(200)
        .json({ message: "Course Already Exists", success: false });
    }
    const newCourse = new courseModel({
      title,
      description,
      price,
      status,
      image,
      preview,
      videos,
    });
    const savedCourse = await newCourse.save();
    res.status(200).json({
      message: "Course Created",
      success: true,
      data: savedCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Edit Course ==============================================

const editCourse = async (req, res, next) => {
  try {
    const { title, description, price, status, image, preview, videos } =
      req.body;
    const courseId = req.params.courseId;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not Found" });
    }
    course.title = title;
    course.description = description;
    course.price = price;
    course.status = status;
    course.image = image;
    course.preview = preview;
    course.videos = videos;
    const savedCourse = await course.save();
    res
      .status(200)
      .json({ success: true, message: "Course Updated", data: savedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Course Status ==============================================

const courseStatus = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not Found" });
    }
    course.status = !course.status;
    const savedCourse = await course.save();
    res.status(200).json({ success: true, message: "Status Updated", data: savedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Delete Course ==============================================

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await courseModel.findOneAndDelete({ _id: courseId });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Project not Found" });
    }
    res.status(200).json({ success: true, message: "Course Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  listCourse,
  insertCourse,
  editCourse,
  courseStatus,
  deleteCourse,
};
