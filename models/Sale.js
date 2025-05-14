// // models/Sale.js
// const mongoose = require('mongoose');

// const saleSchema = new mongoose.Schema({
//   district: { type: String, required: true },
//   date: { type: String, required: true },
//   amount: { type: Number, required: true }
// });

// module.exports = mongoose.model('Sale', saleSchema);


// new model after user update
// const mongoose = require('mongoose');

// const saleSchema = new mongoose.Schema({
//   district: { type: String, required: true },
//   date: { type: String, required: true },
//   amount: { type: Number, required: true },
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }},{
//     timestamps : {
//       createdAt : 'created_at',
//       updatedAt: 'updated_at'
//     }
// });

// module.exports = mongoose.model('Sale', saleSchema);

//new model after branch creation
// const mongoose = require('mongoose');

// const saleSchema = new mongoose.Schema({
//     branch: {type: String, required: true},
//   district: { type: String, required: true },
//   date: { type: String, required: true },
//   amount: { type: Number, required: true },
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }},{
//     timestamps : {
//       createdAt : 'created_at',
//       updatedAt: 'updated_at'
//     }
// });

// module.exports = mongoose.model('Sale', saleSchema);


const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Sale', saleSchema);