const { sequelize } = require('../config/database');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Admin & Staff (both can view)
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total counts - these are safe for staff to view
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const totalUsers = await User.count();

        // Get orders by status
        const ordersByStatus = await Order.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        // Get recent orders (limit 5)
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        // Calculate total revenue (only delivered orders)
        const revenue = await Order.sum('totalAmount', {
            where: {
                status: 'delivered'
            }
        });

        // Get low stock products
        const lowStockProducts = await Product.findAll({
            where: {
                stockQuantity: {
                    [Op.lte]: sequelize.col('lowStockThreshold')
                }
            },
            limit: 5
        });

        // Get monthly sales trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await Order.findAll({
            attributes: [
                [sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
            ],
            where: {
                status: 'delivered',
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: [sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt'))],
            order: [[sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        // If no sales data, create placeholder with zeros
        let formattedMonthlySales = monthlySales;
        if (!monthlySales || monthlySales.length === 0) {
            const months = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                months.push({
                    month: monthStr,
                    total: 0
                });
            }
            formattedMonthlySales = months;
        }

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue: revenue || 0,
                ordersByStatus,
                recentOrders,
                lowStockProducts,
                monthlySales: formattedMonthlySales
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};