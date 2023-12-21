const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    github: {
      type: String,
    },
    youtube: {
      type: String,
    },
    live: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const projectModel = mongoose.model("projects", projectSchema);

module.exports = projectModel;
