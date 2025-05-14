const express = require('express');
const { updatePermissions , getAllUsers } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only route to update permissions
router.put('/users/:id/permissions', authMiddleware , adminMiddleware, updatePermissions);
router.get('/users',authMiddleware, adminMiddleware, getAllUsers )

module.exports = router;
