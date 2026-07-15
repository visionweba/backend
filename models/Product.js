const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Mobiles",
        "Laptops",
        "Audio",
        "Televisions",
        "Cameras",
        "Wearables",
        "Accessories",
        "Gaming",
      ],
    },
    brand: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    rating: { type: Number, default: 4.3 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.virtual("discountPercent").get(function () {
  if (!this.mrp || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
