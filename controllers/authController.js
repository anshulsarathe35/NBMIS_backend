// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role , branch} = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'Email already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({ name, email, password: hashedPassword, role, branch });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//     console.log("Registered successfully")
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
exports.register = async (req, res) => {
    try {
      const { name, email, password, role, branch, adminSecret } = req.body;
  
      // Validate admin secret if role is admin
      if (role === 'admin') {
        if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET || adminSecret!="navabharatdev") {
          return res.status(401).json({ message: 'Invalid admin secret' });
        }
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ name, email, password: hashedPassword, role, branch });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
      console.log("Registered successfully");
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid email or password' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

//     if (role && user.role !== role) return res.status(403).json({ message: 'Access denied for this role' });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET||"navabharat_dev", {
//       expiresIn: '7d'
//     });

//     res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
//     console.log("login successfull")
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
exports.login = async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      if (role && user.role !== role) {
        return res.status(403).json({ message: 'Access denied for this role' });
      }
  
    //   const tokenPayload = { id: user._id, role: user.role };

        const tokenPayload = {
        id: user._id,
        role: user.role,
        branch: user.branch, // ✅ Add branch here
      };
      const secret = process.env.JWT_SECRET || 'navabharat_dev';
  
      const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });
  
      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          branch: user.branch
        },
      });
  
      console.log('✅ Login successful for:', email);
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

//   exports.getProfile = async (req, res) => {
//     try {
//       const user = req.user; 
//       if (!user) return res.status(401).send({ error: "Unauthorized" });
  
//       res.status(200).send({
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         canSale: user.canSale,
//         canReceipt: user.canReceipt,
//         canReport: user.canReport
//       });
//     } catch (err) {
//       res.status(500).send({ error: "Server error" });
//     }
//   };
// exports.getProfile = async (req, res) => {
//     try {
//       const userId = req.user?.id;
//       if (!userId) return res.status(401).send({ error: "Unauthorized" });
  
//       const user = await User.findById(userId).select('name email role canSale canReceipt canReport');
//       if (!user) return res.status(404).send({ error: "User not found" });
  
//       res.status(200).send({
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         canSale: user.canSale,
//         canReceipt: user.canReceipt,
//         canReport: user.canReport
//       });
//     } catch (err) {
//       res.status(500).send({ error: "Server error" });
//     }
//   };
  

exports.getProfile = async (req, res) => {
    try {
      const userId = req.user?.id; // <- use `id` here
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
      const user = await User.findById(userId).select('name email role canSale canReceipt canReport');
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// exports.getProfile = async (req, res) => {
//     try {
//       const userId = req.user?._id;
//       console.log(userId)
//       if (!userId) return res.status(401).send({ error: "Unauthorized" });
  
//       const user = await User.findById(userId).select('name email role canSale canReceipt canReport');
//       if (!user) return res.status(404).send({ error: "User not found" });
  
//       console.log(user)
//       res.status(200).send(user);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send({ error: "Server error" });
//     }
//   };


//   //NEWLY ADDED 
//   exports.register = async (req, res) => {
//     try {
//       const { name, email, password, branch, role } = req.body;
  
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(409).json({ message: 'User already exists with this email' });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         branch,
//         role: role || 'user',
//       });
  
//       const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'navabharat_dev', {
//         expiresIn: '7d',
//       });
  
//       res.status(201).json({
//         token,
//         user: {
//           id: newUser._id,
//           name: newUser.name,
//           email: newUser.email,
//           role: newUser.role,
//           branch: newUser.branch,
//         },
//       });
  
//       console.log('✅ User registered:', email);
//     } catch (error) {
//       console.error('❌ Registration error:', error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };