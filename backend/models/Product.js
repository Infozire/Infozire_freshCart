const mongoose = require("mongoose");

// ✅ Separate Schema (clean + reusable)
const bulkOptionSchema = new mongoose.Schema({
  qty: {
    type: Number,
    required: true,   // 5, 10, 15
  },
  unit: {
    type: String,
    required: true,   // kg, liter
    default: "kg",
  },
  price: {
    type: Number,
    required: true,   // total price for that qty
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: String,
    images: [String],

    description: String,

    price: { type: Number, required: true }, // price per unit
    mrp: Number,
    discount: Number,

    unit: { type: String, default: "kg" },
    quantity: Number,

    brand: String,

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // ✅ IMPROVED BULK OPTIONS
    bulkOptions: {
      type: [bulkOptionSchema],
      default: [],   // prevent undefined issues
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);