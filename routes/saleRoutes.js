// routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Sale operations
router.get('/', saleController.getSalesByDate);

//correct routes
router.post('/', authMiddleware, saleController.createOrUpdateSale);
router.delete('/:id', authMiddleware, saleController.deleteSale);

//just for dev purpose 
// router.post('/', saleController.createOrUpdateSale);
// router.delete('/:id', saleController.deleteSale);

module.exports = router;
