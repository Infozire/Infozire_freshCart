const User = require('../models/User');

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
