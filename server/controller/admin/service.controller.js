const serviceModel = require("../../model/service.model");

//! ============================================== List Service ==============================================

const listService = async (req, res, next) => {
  try {
    const services = await serviceModel.find({});
    res.status(200).json({
      message: "Services Fetched",
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! =============================================== Add Service ===============================================

const insertService = async (req, res, next) => {
  try {
    const { title, description, link, image } = req.body;
    const serviceExists = await serviceModel.findOne({ title: req.body.title });
    if (serviceExists) {
      return res
        .status(200)
        .json({ message: "Already Exists", success: false });
    }
    const newService = new serviceModel({
      title,
      description,
      link,
      image,
    });
    const savedService = await newService.save();
    res.status(200).json({
      message: "Service Created",
      success: true,
      data: savedService,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Edit Service ==============================================

const editService = async (req, res, next) => {
  try {
    const { image, title, description, link } = req.body;
    const serviceId = req.params.serviceId;
    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not Found" });
    }
    service.image = image;
    service.title = title;
    service.description = description;
    service.link = link;
    const savedService = await service.save();
    res
      .status(200)
      .json({ success: true, message: "Service Updated", data: savedService });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Service Status ==============================================

const serviceStatus = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not Found" });
    }
    service.status = !service.status;
    const savedService = await service.save();
    res
      .status(200)
      .json({ success: true, message: "Status Updated", data: savedService });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Delete Service ==============================================

const deleteService = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await serviceModel.findOneAndDelete({ _id: serviceId });
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not Found" });
    }
    res.status(200).json({ success: true, message: "Service Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  listService,
  insertService,
  editService,
  serviceStatus,
  deleteService,
};
