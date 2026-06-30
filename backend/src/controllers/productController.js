const Product = require('../models/Product');
const Category = require('../models/Category');
const { Op } = require('sequelize');

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stockQuantity, sku, categoryId, lowStockThreshold } = req.body;

        // Check if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if SKU exists
        const productExists = await Product.findOne({ where: { sku } });
        if (productExists) {
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU already exists'
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stockQuantity,
            sku,
            categoryId,
            lowStockThreshold: lowStockThreshold || 10
        });

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get all products with filters
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            category, 
            minPrice, 
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;

        // Build filter conditions
        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        if (category) {
            where.categoryId = category;
        }
        if (minPrice) {
            where.price = { [Op.gte]: minPrice };
        }
        if (maxPrice) {
            where.price = { ...where.price, [Op.lte]: maxPrice };
        }

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [{
                model: Category,
                attributes: ['id', 'name']
            }],
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            products: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                attributes: ['id', 'name']
            }]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update(req.body);

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update stock
// @route   PATCH /api/products/:id/stock
exports.updateStock = async (req, res) => {
    try {
        const { stockQuantity } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update({ stockQuantity });

        // Check for low stock alert
        if (stockQuantity <= product.lowStockThreshold) {
            // Here you could trigger a notification
            console.log(`⚠️ Low stock alert: ${product.name} has ${stockQuantity} units left`);
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
exports.getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                stockQuantity: {
                    [Op.lte]: sequelize.col('lowStockThreshold')
                }
            },
            include: [{
                model: Category,
                attributes: ['id', 'name']
            }],
            order: [['stockQuantity', 'ASC']]
        });

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Get low stock products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};