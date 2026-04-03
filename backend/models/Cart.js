const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
         bulkQty: { type: Number, default: null },
      bulkPrice: { type: Number, default: null }
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
