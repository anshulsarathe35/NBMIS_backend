// models/Receipt.js
// const mongoose = require('mongoose');

// const receiptSchema = new mongoose.Schema({
//   district: { type: String, required: true },
//   date: { type: String, required: true },
//   cash: { type: Number, default: 0 },
//   online: { type: Number, default: 0 },
//   bank: { type: Number, default: 0 },
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }},{
//     timestamps : {
//       createdAt : 'created_at',
//       updatedAt: 'updated_at'
//     }
// });

// module.exports = mongoose.model('Receipt', receiptSchema);


//new update after branch creation
// const mongoose = require('mongoose');

// const receiptSchema = new mongoose.Schema({
//     branch: {type: String, required: true},
//   district: { type: String, required: true },
//   date: { type: String, required: true },
//   cash: { type: Number, default: 0 },
//   online: { type: Number, default: 0 },
//   bank: { type: Number, default: 0 },
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }},{
//     timestamps : {
//       createdAt : 'created_at',
//       updatedAt: 'updated_at'
//     }
// });

// module.exports = mongoose.model('Receipt', receiptSchema);


const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    branch: {type: String, required: true},
  district: { type: String, required: true },
  date: { type: String, required: true },
  cash: { type: Number, default: 0 },
  private: { type: Number, default: 0 },
  gov: { type: Number, default: 0 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }},{
    timestamps : {
      createdAt : 'created_at',
      updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Receipt', receiptSchema);
