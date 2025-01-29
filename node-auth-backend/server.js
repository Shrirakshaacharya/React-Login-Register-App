const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multer = require("multer");
const otpGenerator = require("otp-generator");

const app = express();
app.use(bodyParser.json()); // For parsing JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/auth_system", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection failed:", err));

// User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  company: String,
  age: Number,
  dob: Date,
  image: String,
  otp: String,
  otpExpiry: Date,
});

const User = mongoose.model("User", userSchema);

// Image storage configuration
const upload = multer({ storage: multer.memoryStorage() });

// Routes

// Registration
app.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, company, age, dob } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file.buffer.toString("base64"); // Convert image to base64

    const newUser = new User({ name, email, password: hashedPassword, company, age, dob, image });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Registration failed. Email may already exist." });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
  await user.save();

  res.json({ message: "OTP sent successfully!", otp }); // Send OTP for simplicity
});

// OTP Verification
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
    return res.status(400).json({ error: "Invalid or expired OTP." });
  }

  // OTP is valid
  res.json({ message: "Login successful!", userDetails: user });
});

// Account Deletion
app.delete("/account", async (req, res) => {
  const { email } = req.body;
  await User.findOneAndDelete({ email });
  res.json({ message: "Account deleted successfully." });
});

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3001"));
