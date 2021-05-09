const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alumni = "alumni";
const present_student = "present_student";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, select: false },

    passout_year: { type: String, required: true },

    department: { type: String, required: true },

    role: { type: String, required: true, enum: [alumni, present_student, "root"] },

    registration_number: { type: String },

    username: { type: String, required: true, unique: true, trim: true },

    profilePicUrl: { type: String },

    newMessagePopup: { type: Boolean, default: true },

    unreadMessage: { type: Boolean, default: false },

    unreadNotification: { type: Boolean, default: false },

    resetToken: { type: String },

    expireToken: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
