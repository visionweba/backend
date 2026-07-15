const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  removeImage,
  deleteProduct,
  getAllProductsAdmin,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/admin/all", protect, adminOnly, getAllProductsAdmin);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, upload.array("images", 6), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 6), updateProduct);
router.put("/:id/remove-image", protect, adminOnly, removeImage);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
