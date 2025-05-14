// // backend/routes/reportRoutes.js
// const express = require('express');
// const router = express.Router();
// const reportController = require('../controllers/reportController');

// // Ensure the handler functions are correctly imported and are functions
// router.get('/', reportController.getReports);               // Get reports for a date range
// router.get('/sales/excel', reportController.downloadSalesExcel); // Download sales report as Excel
// router.get('/sales/pdf', reportController.downloadSalesPDF);    // Download sales report as PDF
// router.get('/receipts/excel', reportController.downloadReceiptsExcel); // Download receipts report as Excel
// router.get('/receipts/pdf', reportController.downloadReceiptsPDF);    // Download receipts report as PDF

// module.exports = router;

// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.get('/', authMiddleware, reportController.getReports);

router.get('/sales/excel',authMiddleware, reportController.downloadSalesExcel);
router.get('/sales/pdf', authMiddleware, reportController.downloadSalesPDF);

router.get('/receipts/excel',authMiddleware, reportController.downloadReceiptsExcel);
router.get('/receipts/pdf',authMiddleware, reportController.downloadReceiptsPDF);

module.exports = router;
