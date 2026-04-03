const router = require("express").Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeItem
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/:userId", getCart);

// ✅ IMPORTANT (YOU ARE MISSING THIS)
router.post("/update", updateCart);
router.post("/remove", removeItem);

module.exports = router;
