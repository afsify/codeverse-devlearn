const developerModel = require("../../model/developer.model");
const userModel = require("../../model/user.model");

//! ============================================ Developer Request ============================================

const devRequest = async (req, res, next) => {
  try {
    const devData = await developerModel
      .find()
      .populate("user", ["name", "email", "developer", "image"]);
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

//! ============================================ Accept Request ============================================

const acceptDev = async (req, res, next) => {
  try {
    const dev = await developerModel.findByIdAndUpdate(
      req.params.devId,
      { status: "accepted" },
      { new: true }
    );
    if (!dev) {
      return res.status(404).json({
        message: "Developer Not Found",
        success: false,
      });
    }
    await userModel.findByIdAndUpdate(
      dev.user,
      { developer: true },
      { new: true }
    );
    res.status(200).json({
      message: "Request Accepted",
      success: true,
      dev,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================ Reject Request ============================================

const rejectDev = async (req, res, next) => {
  try {
    const dev = await developerModel.findByIdAndUpdate(
      req.params.devId,
      { status: "rejected" },
      { new: true }
    );
    if (!dev) {
      return res.status(404).json({
        message: "Developer Not Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Request Accepted",
      success: true,
      dev,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================ Remove Request ============================================

const removeDev = async (req, res, next) => {
  try {
    const dev = await developerModel.findByIdAndUpdate(
      req.params.devId,
      { status: "removed" },
      { new: true }
    );
    if (!dev) {
      return res.status(404).json({
        message: "Developer Not Found",
        success: false,
      });
    }
    await userModel.findByIdAndUpdate(
      dev.user,
      { developer: false },
      { new: true }
    );
    res.status(200).json({
      message: "Request Accepted",
      success: true,
      dev,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  devRequest,
  acceptDev,
  rejectDev,
  removeDev,
};
