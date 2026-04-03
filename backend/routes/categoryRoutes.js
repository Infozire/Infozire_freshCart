const express = require("express");
const router = express.Router();

const {
  getCategories,
  addCategory,
  seedCategories,
} = require("../controllers/categoryController");

// ✅ Routes
router.get("/", getCategories);
router.post("/", addCategory);
router.post("/seed", seedCategories);

module.exports = router;