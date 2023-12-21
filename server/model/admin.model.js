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
  image: String,
  resume: String,
  phone: String,
  address: String,
  contact: {
    linkedIn: String,
    github: String,
    youtube: String,
    instagram: String,
    whatsapp: String,
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
        type: Number,
        min: 0,
        max: 100,
      },
    },
  ],
});

const adminModel = mongoose.model("admins", adminSchema);

module.exports = adminModel;
