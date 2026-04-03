const Category = require("../models/Category");

// ✅ Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add Category
exports.addCategory = async (req, res) => {
  try {
    const { name, slug, image, description } = req.body;

    const category = new Category({
      name,
      slug,
      image, // "/uploads/categories/xyz.jpg"
      description,
    });

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Seed Categories (RUN ONCE)
exports.seedCategories = async (req, res) => {
  try {
    await Category.deleteMany();

    const data = await Category.insertMany([
      {
        name: "🥬 Vegetables",
        slug: "vegetables",
        image: "/uploads/categories/vegetables.jpg",
        description: "Fresh vegetables",
      },
      {
        name: "🛒 Groceries",
        slug: "groceries",
        image: "/uploads/categories/groceries.jpg",
        description: "Daily essentials",
      },
      {
        name: "🍽️ Plastics & Serving",
        slug: "plastics-serving",
        image: "/uploads/categories/plastics.jpg",
        description: "Serving items",
      },
      {
        name: "🥛 Dairy",
        slug: "dairy",
        image: "/uploads/categories/dairy.jpg",
        description: "Milk products",
      },
      {
        name: "🎉 Event Essentials",
        slug: "event-essentials",
        image: "/uploads/categories/events.jpg",
        description: "Event needs",
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};