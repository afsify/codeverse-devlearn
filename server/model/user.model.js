const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      default: "unblocked",
    },
    developer: {
      type: Boolean,
      default: false,
    },
    prime: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: String,
      default: "none",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    phone: {
      type: Number,
    },
    place: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.endDate && this.endDate <= Date.now()) {
    this.prime = false;
  }
  next();
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
