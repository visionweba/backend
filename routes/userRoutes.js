const express = require("express");
const {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
  getDashboardStats,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats/dashboard", getDashboardStats);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/block", toggleBlockUser);
router.delete("/:id", deleteUser);

module.exports = router;
