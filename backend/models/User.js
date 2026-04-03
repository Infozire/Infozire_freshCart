const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  address: {
    flat: String,
    area: String,
    city: String,
    state: String,
    pincode: String
  }
});

module.exports = mongoose.model('User', userSchema);
