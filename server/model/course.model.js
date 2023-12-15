const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: true,
    },
    preview: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: String,
        required: true,
      },
    ],
    reviews: [
      {
        reviewer: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model("courses", courseSchema);

module.exports = courseModel;
