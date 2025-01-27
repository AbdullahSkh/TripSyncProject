const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username, gender, age } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      gender,
      age,
    });
    res.json({
      id: user._id,
      email: user.email,
      password: user.password,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bycrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

router.post("/login-oauth", async (req, res) => {
  const { email, username, oauthProvider, oauthId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        username,
        oauthProvider,
        oauthId,
        profilePic,
        profileComplete: false,
      });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      profileComplete: user.profileComplete,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during OAuth login", error });
  }
});

module.exports = router;
