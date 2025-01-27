const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

require("dotenv").config();
require("./config/passport");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}
