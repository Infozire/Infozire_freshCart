const express = require('express');
const router = express.Router();
const { getAddress, updateAddress } = require('../controllers/userController');

// GET saved address
router.get('/:id/address', getAddress);

// PUT update address
router.put('/:id/address', updateAddress);

module.exports = router;
