const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const loginHistorySchema = new mongoose.Schema(
  {
    ip: String,
    device: String,
    browser: String,
    os: String,
    city: String,
    state: String,
    country: String,
    loginAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },

    // Latest session info (denormalized for fast admin table display)
    lastIp: String,
    lastDevice: String,
    lastBrowser: String,
    lastOs: String,
    lastCity: String,
    lastState: String,
    lastCountry: String,
    lastActiveAt: Date,

    loginHistory: [loginHistorySchema],

    addresses: [
      {
        label: { type: String, default: "Home" },
        fullName: String,
        phone: String,
        line1: String,
        city: String,
        state: String,
        pincode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
