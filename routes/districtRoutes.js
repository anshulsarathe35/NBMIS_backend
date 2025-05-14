// routes/districtRoutes.js
const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// CRUD operations for District
// router.get('/', districtController.getAllDistricts);
router.get('/', authMiddleware, districtController.getAllDistricts);

// router.post('/', authMiddleware, adminMiddleware, districtController.createDistrict);

//added for dev
router.post('/', authMiddleware, districtController.createDistrict);
router.put('/:id', authMiddleware, adminMiddleware, districtController.updateDistrict);
router.delete('/:id', authMiddleware, adminMiddleware, districtController.deleteDistrict);

router.get('/branch', authMiddleware, districtController.getDistrictsByBranch)

module.exports = router;
