const express = require("express");
const { signup, login, adminLogin, adminSignup, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/admin-signup", adminSignup);
router.get("/me", protect, getProfile);

module.exports = router;
