const express = require('express');
const { updatePermissions , getAllUsers } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getBranchReports,
  downloadSalesPDF,
  downloadReceiptsPDF
} = require('../controllers/adminController');

const router = express.Router();

// Admin-only route to update permissions
router.put('/users/:id/permissions', authMiddleware , adminMiddleware, updatePermissions);
router.get('/users',authMiddleware, adminMiddleware, getAllUsers )



//added after 22may for branch wise reports
router.post('/branch-reports',authMiddleware, getBranchReports);
router.post('/branch-reports/download/sales', authMiddleware, downloadSalesPDF);
router.post('/branch-reports/download/receipts', authMiddleware, downloadReceiptsPDF);


module.exports = router;
