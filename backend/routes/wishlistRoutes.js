const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// ✅ Routes
router.get("/:userId", getWishlist);
router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);

module.exports = router;
