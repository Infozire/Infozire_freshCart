const express = require('express');
const router = express.Router();
const { getAddress, updateAddress,getUserProfile,updateUserProfile   } = require('../controllers/userController');

// GET saved address
router.get('/:id/address', getAddress);

// PUT update address
router.put('/:id/address', updateAddress);
router.get('/:id', getUserProfile);
router.put("/update", updateUserProfile);

module.exports = router;
