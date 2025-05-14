// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User')

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token', error: err.message });
//   }
// };

//added after permissions corrected one
// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
  
//     if (!token) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'navabharat_dev');
//       req.user = decoded; // decoded contains { id, role }
//       next();
//     } catch (err) {
//       res.status(401).json({ message: 'Invalid token', error: err.message });
//     }
//   };


//added 
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'navabharat_dev');
    
    // Fetch full user from DB
    const user = await User.findById(decoded.id); // ensure your JWT encodes `id` correctly
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    req.user = user; // now req.user will have .branch and all other fields
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.error("Only admins can edit")
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
