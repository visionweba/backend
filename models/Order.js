const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: String,
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },

    shippingInfo: {
      fullName: String,
      phone: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },

    status: {
      type: String,
      enum: [
        "Placed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Failed Delivery",
        "Cancelled",
      ],
      default: "Placed",
    },
    statusHistory: [statusHistorySchema],
    paymentMethod: { type: String, default: "COD" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
