const User = require('../models/User');
const bcrypt = require("bcryptjs");

// ✅ Get user address
exports.getAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ address: user.address || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update user address
exports.updateAddress = async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ msg: "Address is required" });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.address = address;
    await user.save();

    res.json({ msg: "Address updated successfully", address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
// ✅ Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
// ✅ UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId, name, email, phone, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ✅ Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // ✅ HASH PASSWORD (IMPORTANT FIX)
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
};