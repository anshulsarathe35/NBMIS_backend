// controllers/districtController.js
const District = require('../models/District');

// exports.getAllDistricts = async (req, res) => {
//   try {
//     const districts = await District.find().sort({ name: 1 });
//     res.json(districts);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch districts', error: err.message });
//   }
// };

// exports.createDistrict = async (req, res) => {
//   try {
//     const { name } = req.body;

//     const existing = await District.findOne({ name });
//     if (existing) return res.status(400).json({ message: 'District already exists' });

//     const newDistrict = new District({ name });
//     await newDistrict.save();

//     res.status(201).json({ message: 'District added successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to add district', error: err.message });
//   }
// };

exports.getAllDistricts = async (req, res) => {
    try {
      const branch = req.user.branch;
      if (!branch) return res.status(400).json({ message: 'User branch missing' });
  
      const districts = await District.find({ branch }).sort({ name: 1 });
      res.json(districts);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch districts', error: err.message });
    }
  };
  
  exports.createDistrict = async (req, res) => {
    try {
      const { name } = req.body;
      const branch = req.user.branch;
  
      if (!branch) return res.status(400).json({ message: 'User branch missing' });
  
      const existing = await District.findOne({ name, branch });
      if (existing) return res.status(400).json({ message: 'District already exists in this branch' });
  
      const newDistrict = new District({ name: name.toUpperCase(), branch });

      await newDistrict.save();
  
      res.status(201).json({ message: 'District added successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add district', error: err.message });
    }
  };
  

exports.updateDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await District.findByIdAndUpdate(id, { name: name.toUpperCase() }, { new: true });

    if (!updated) return res.status(404).json({ message: 'District not found' });

    res.json({ message: 'District updated successfully', district: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update district', error: err.message });
  }
};

exports.deleteDistrict = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await District.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'District not found' });

    res.json({ message: 'District deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete district', error: err.message });
  }
};

exports.getDistrictsByBranch = async (req, res) => {
    try {
        const branch = req.user.branch; // ✅ Safe and from server side
        // const districts = await District.find({ branch });
        console.log(branch)
        
      if (!branch) return res.status(400).json({ message: 'Branch not specified' });
  
      const districts = await District.find({ branch });
      res.status(200).json(districts);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
