const Product = require("../models/Product");

const mongoose = require("mongoose");

// ✅ Get all / filter by category
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    // ✅ FIX: Ensure proper ObjectId handling
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Seed products
exports.seedProducts = async (req, res) => {
  try {
    await Product.deleteMany();

    const data = await Product.insertMany([
      {
        name: "Fresh Tomatoes",
        slug: "fresh-tomatoes",
        category: "CATEGORY_ID_HERE",
        image: "/uploads/products/tomato.jpg",
        price: 40,
        mrp: 50,
        discount: 20,
        unit: "kg",
        quantity: 100,
        brand: "Local Farm",
        description: "Fresh red tomatoes",
      },
      {
        name: "Milk 1L",
        slug: "milk-1l",
        category: "CATEGORY_ID_HERE",
        image: "/uploads/products/milk.jpg",
        price: 60,
        mrp: 70,
        unit: "liter",
        quantity: 50,
        brand: "Aavin",
        description: "Pure milk",
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};