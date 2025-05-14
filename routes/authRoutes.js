// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const getProfile = require('../controllers/getProfile')
const {authMiddleware} = require('../middleware/authMiddleware')

const User = require('../models/User');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get("/profile", authMiddleware, authController.getProfile)


//just for dev
// router.get('/profile', authMiddleware, async (req, res) => {
//     try {
//       const user = await User.findById(req.user).select('name email role canSale canReceipt canReport');
//       console.log(user)
//       res.json(user);
//     } catch (err) {
//       res.status(500).send({ error: 'Failed to fetch profile' });
//     }
//   });

module.exports = router;
