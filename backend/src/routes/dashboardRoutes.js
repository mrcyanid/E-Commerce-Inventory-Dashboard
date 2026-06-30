const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// Allow both Admin and Staff to view dashboard stats
router.get('/stats', protect, getDashboardStats);  // Removed authorize('admin')

module.exports = router;