const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
    },
    experience: {
      type: String,
    },
    status: {
      type: String,
      default: "requested",
    },
  },
  { timestamps: true }
);

const developerModel = mongoose.model("developers", developerSchema);

module.exports = developerModel;
