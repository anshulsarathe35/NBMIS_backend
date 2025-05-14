// routes/receiptRoutes.js
const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Receipt operations
router.get('/', receiptController.getReceiptsByDate);
router.post('/', authMiddleware, receiptController.createOrUpdateReceipt);
router.delete('/:id', authMiddleware, receiptController.deleteReceipt);

module.exports = router;
    