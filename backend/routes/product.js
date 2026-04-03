const router3 = require('express').Router();
const {
  addProduct,
  getProducts,
  getProductById,
  getProductsByCategory
} = require('../controllers/productController');

router3.post('/', addProduct);
router3.get('/', getProducts);
router3.get("/category/:categoryId", getProductsByCategory);

// ✅ ADD THIS ROUTE
router3.get('/:id', getProductById);

module.exports = router3;
