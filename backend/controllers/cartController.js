const Cart = require("../models/Cart");

// ✅ COMMON MATCH FUNCTION (BEST PRACTICE)
const isSameItem = (i, productId, bulkQty, bulkUnit) => {
  return (
    i.productId.toString() === productId &&
    Number(i.bulkQty || 0) === Number(bulkQty || 0) &&
    (i.bulkUnit || "") === (bulkUnit || "")
  );
};


// ✅ ADD TO CART (Bulk-safe + Type-safe)
exports.addToCart = async (req, res) => {
  const { userId, productId, bulkQty, bulkUnit, bulkPrice } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((i) =>
      isSameItem(i, productId, bulkQty, bulkUnit)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
        bulkQty: bulkQty ? Number(bulkQty) : null,   // ✅ FIX
        bulkUnit: bulkUnit || null,
        bulkPrice: bulkPrice || null,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Add to cart failed" });
  }
};


// ✅ GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("items.productId");

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Fetch cart error" });
  }
};


// ✅ UPDATE CART (Bulk-safe + FIXED)
exports.updateCart = async (req, res) => {
  const { userId, productId, bulkQty, bulkUnit, type } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ items: [] });

    const item = cart.items.find((i) =>
      isSameItem(i, productId, bulkQty, bulkUnit)
    );

    if (!item) return res.json(cart);

    if (type === "inc") {
      item.quantity += 1;
    }

    if (type === "dec") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // ✅ remove properly
        cart.items = cart.items.filter(
          (i) => !isSameItem(i, productId, bulkQty, bulkUnit)
        );
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update cart failed" });
  }
};


// ✅ REMOVE ITEM (Bulk-safe + FIXED)
exports.removeItem = async (req, res) => {
  const { userId, productId, bulkQty, bulkUnit } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(
      (i) => !isSameItem(i, productId, bulkQty, bulkUnit)
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Remove item failed" });
  }
};
