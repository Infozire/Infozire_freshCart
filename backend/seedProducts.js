const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/yourdb");

// ===== CATEGORY SCHEMA =====
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const Category = mongoose.model("Category", categorySchema);

// ===== PRODUCT SCHEMA =====
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  price: Number,
  discountPrice: Number,
  quantity: Number,
  unit: String,
  description: String,
  stock: Number,
  minOrderQty: Number,
  images: [String],
});

const Product = mongoose.model("Product", productSchema);

// ===== DATA =====
const categories = [
  "Vegetables",
  "Grains",
  "Pulses",
  "Spices",
  "Oils",
  "Dairy",
  "Catering Supplies",
  "Meal Kits"
];

const dataMap = {
  Vegetables: ["Onion", "Tomato", "Potato", "Carrot", "Beans"],
  Grains: ["Rice", "Wheat Flour", "Maida", "Rava"],
  Pulses: ["Toor Dal", "Urad Dal", "Moong Dal"],
  Spices: ["Turmeric Powder", "Chilli Powder", "Coriander Powder"],
  Oils: ["Cooking Oil", "Ghee"],
  Dairy: ["Milk", "Curd", "Paneer"],
  "Catering Supplies": ["Paper Plates", "Plastic Cups", "Spoons"],
  "Meal Kits": ["Biryani Kit", "Sambar Kit", "Veg Meals Kit"]
};

const images = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e",
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc"
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();

    // Insert Categories
    const categoryDocs = categories.map((cat) => ({
      name: cat,
      slug: cat.toLowerCase().replace(/\s/g, "-"),
    }));

    await Category.insertMany(categoryDocs);
    console.log("✅ Categories Inserted");

    const products = [];

    categories.forEach((cat) => {
      const items = dataMap[cat];

      for (let i = 1; i <= 200; i++) { // 200 per category → total ~1600
        const item = getRandom(items);

        products.push({
          name: `${item} Bulk Pack ${i}`,
          slug: `${item.toLowerCase().replace(/\s/g, "-")}-${i}`,
          category: cat,
          price: Math.floor(Math.random() * 500) + 50,
          discountPrice: Math.floor(Math.random() * 400) + 30,
          quantity: Math.floor(Math.random() * 100) + 10,
          unit: cat === "Vegetables" || cat === "Grains" ? "kg" : "pack",
          stock: Math.floor(Math.random() * 500) + 50,
          minOrderQty: 5,
          description: `High quality ${item} suitable for marriage and event cooking.`,
          images: [getRandom(images)],
        });
      }
    });

    await Product.insertMany(products);

    console.log("🎉 Products Inserted Successfully");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();