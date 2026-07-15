const Product = require("../models/Product");

// @desc  Get all active products (supports search, category, price filter)
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, maxPrice, sort } = req.query;
    const filter = { isActive: true };

    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    let query = Product.find(filter);

    if (sort === "priceLowToHigh") query = query.sort({ price: 1 });
    else if (sort === "priceHighToLow") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single product by id
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Admin only below ----------

// @desc  Create product (with uploaded images)
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const { title, description, price, mrp, category, brand, stock } = req.body;
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const product = await Product.create({
      title,
      description,
      price,
      mrp,
      category,
      brand,
      stock,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update product
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const fields = ["title", "description", "price", "mrp", "category", "brand", "stock", "isActive"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Remove single image from product
// @route PUT /api/products/:id/remove-image
const removeImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.images = product.images.filter((img) => img !== req.body.image);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all products for admin (including inactive)
// @route GET /api/products/admin/all
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  removeImage,
  deleteProduct,
  getAllProductsAdmin,
};
