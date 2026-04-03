// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String, // ✅ MUST be string path like /uploads/...
  description: String,
});

module.exports = mongoose.model("Category", categorySchema);