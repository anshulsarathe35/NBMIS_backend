// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  canSale: { type: Boolean, default: false },
  canReceipt: { type: Boolean, default: false },
  canReport: {type: Boolean, default: false},
  branch: {type: String, required: true}},{
    timestamps : {
      createdAt : 'created_at',
      updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('User', userSchema);
