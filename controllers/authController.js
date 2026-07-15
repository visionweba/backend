console.log("AUTH CONTROLLER LOADED");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const getDeviceInfo = require("../utils/deviceInfo");

// @desc  Register a new user
// @route POST /api/auth/signup
// const signup = async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Name, email and password are required" });
//     }

//     const existing = await User.findOne({ email: email.toLowerCase() });
//     if (existing) return res.status(400).json({ message: "Email already registered" });

//     const user = await User.create({ name, email, password, phone });

//     const info = getDeviceInfo(req);
//     user.lastIp = info.ip;
//     user.lastDevice = info.device;
//     user.lastBrowser = info.browser;
//     user.lastOs = info.os;
//     user.lastCity = info.city;
//     user.lastState = info.state;
//     user.lastCountry = info.country;
//     user.lastActiveAt = new Date();
//     user.loginHistory.push({ ...info, loginAt: new Date() });
//     await user.save();

//     const token = generateToken(user._id, user.role);
//     res.status(201).json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const signup = async (req, res) => {
  try {
    console.log("STEP 1");

    const { name, email, password, phone } = req.body;

    console.log("STEP 2");

    const existing = await User.findOne({ email: email.toLowerCase() });

    console.log("STEP 3");

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    console.log("STEP 4", user);
    console.log(req.body);

    return res.json({ success: true });

  } catch (error) {
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked by admin" });
    }

    const info = getDeviceInfo(req);
    user.lastIp = info.ip;
    user.lastDevice = info.device;
    user.lastBrowser = info.browser;
    user.lastOs = info.os;
    user.lastCity = info.city;
    user.lastState = info.state;
    user.lastCountry = info.country;
    user.lastActiveAt = new Date();
    user.loginHistory.unshift({ ...info, loginAt: new Date() });
    user.loginHistory = user.loginHistory.slice(0, 20);
    await user.save();

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Admin login (role must be admin)
// @route POST /api/auth/admin-login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });

    if (!user || !(await user.matchPassword(password)) || user.role !== "admin") {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create the first / additional admin (protected by a secret code)
// @route POST /api/auth/admin-signup
const adminSignup = async (req, res) => {
  try {
    const { name, email, password, code } = req.body;
    if (code !== process.env.ADMIN_SIGNUP_CODE) {
      return res.status(403).json({ message: "Invalid admin signup code" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role: "admin" });
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged in user's profile
// @route GET /api/auth/me
const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { signup, login, adminLogin, adminSignup, getProfile };
