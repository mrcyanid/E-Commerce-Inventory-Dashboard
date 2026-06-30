const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    getMyOrders
} = require('../controllers/orderController');

// Routes
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);  // Remove authorize('admin') - allow staff
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus); // Only admin can update

module.exports = router;