// Make sure 'User' model is imported at the top
const User = require('../models/User');

exports.updatePermissions = async (req, res) => {
  const { canSale, canReceipt, canReport } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { canSale, canReceipt, canReport },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating permissions' });
  }
};


exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // omit passwords
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };