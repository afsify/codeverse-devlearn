const developerModel = require("../../model/developer.model");
const { body, validationResult } = require("express-validator");

//! ============================================= Create Developer =============================================

const createDev = async (req, res, next) => {
  const validations = [
    body("type").notEmpty().withMessage("Type is required"),
    body("domain").notEmpty().withMessage("Domain is required"),
    body("github").isURL().withMessage("Invalid GitHub URL"),
    body("linkedin").isURL().withMessage("Invalid LinkedIn URL"),
    body("skills").isArray().withMessage("Skills must be an array"),
    body("experience")
      .optional()
      .isString()
      .withMessage("Experience must be a string"),
  ];

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { type, domain, github, linkedin, skills, experience } = req.body;
    const user = req.userId;
    const newDeveloper = developerModel({
      user,
      type,
      domain,
      github,
      linkedin,
      skills,
      experience,
    });
    await newDeveloper.save();
    const devData = await developerModel
      .findOne({ user: req.userId })
      .populate("user", ["name", "email", "developer", "image"])
      .sort({ createdAt: -1 })
      .limit(1);
    res.status(200).send({
      message: "Form Submitted",
      success: true,
      data: devData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================= List Developer =============================================

const listDev = async (req, res, next) => {
  try {
    const devData = await developerModel
      .findOne({ user: req.userId })
      .populate("user", ["name", "email", "developer", "image"])
      .sort({ createdAt: -1 })
      .limit(1);
    res.status(200).send({
      message: "DevData Fetched Successfully",
      success: true,
      data: devData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =========================================== Discover Developer ===========================================

const discoverDev = async (req, res, next) => {
  try {
    const devData = await developerModel
      .find({ status: "accepted" })
      .populate("user", ["name", "email", "developer", "image"])
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "DevData Fetched Successfully",
      success: true,
      data: devData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  createDev,
  listDev,
  discoverDev,
};
