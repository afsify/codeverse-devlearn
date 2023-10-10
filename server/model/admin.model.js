const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  address: String,
  contact: {
    instagram: String,
    linkedIn: String,
    github: String,
    twitter: String,
  },
  education: [
    {
      institution: String,
      course: String,
      branch: String,
      year: Number,
    },
  ],
  skill: [
    {
      name: {
        type: String,
        required: true,
      },
      proficiency: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        default: "Intermediate",
      },
    },
  ],
});

const adminModel = mongoose.model("admins", adminSchema);

module.exports = adminModel;
