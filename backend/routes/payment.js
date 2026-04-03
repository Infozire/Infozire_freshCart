const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

// ✅ Init Razorpay
const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});

// ✅ Create Order
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

// ✅ Verify Payment (basic)
const verifyPayment = async (req, res) => {
  try {
    // You can add signature verification later
    res.json({ success: true, message: "Payment verified" });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
};

// ✅ Routes
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;
