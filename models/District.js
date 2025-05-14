// // models/District.js
// const mongoose = require('mongoose');

// const districtSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true }},{
//   timestamps : {
//     createdAt : 'created_at',
//     updatedAt: 'updated_at'
//   }
// });

// module.exports = mongoose.model('District', districtSchema);


//new district schema after branch addition 

const mongoose = require('mongoose')

const districtSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    branch: { type: String, required: true }}, // or ObjectId if branches are stored separately
    {
          timestamps : {
            createdAt : 'created_at',
            updatedAt: 'updated_at'
    }
  });

  
module.exports = mongoose.model('District', districtSchema)