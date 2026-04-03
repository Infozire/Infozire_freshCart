const Wishlist = require("../models/wishlistModel");

// ✅ GET USER WISHLIST
const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId }).populate("products.productId");
    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [{ productId }] });
    } else {
      // Prevent duplicates
      if (!wishlist.products.some((p) => p.productId.toString() === productId)) {
        wishlist.products.push({ productId });
      }
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => p.productId.toString() !== productId
      );
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
