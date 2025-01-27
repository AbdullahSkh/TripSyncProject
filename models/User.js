const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.oauthProvider;
    },
  },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
  age: { type: Number, default: null },
  profilePic: String,
  address: String,
  phoneNumber: String,
  travelPreference: { type: String, default: "Unknown" },
  partnerPreference: String,
  verificationDocument: String,
  isVerified: { type: Boolean, default: false },

  oauthProvider: {
    type: String,
    enum: ["google", "facebook", null],
    default: null,
  },
  oauthId: { type: String, unique: true, sparse: true },
  profileComplete: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
