const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite'),
    logging: false,
    define: {
        timestamps: true
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite3 database connected successfully!');
        console.log(`📁 Database file: ${process.env.DB_STORAGE || './database.sqlite'}`);
        
        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('✅ All models synchronized!');

        // ============================================
        // ✅ FORCE SEED - ALWAYS CREATE FRESH USERS
        // ============================================
        console.log('🔄 FORCE SEED: Removing existing users...');
        
        // Delete ALL existing users (clean start)
        await User.destroy({ where: {} });
        console.log('✅ All existing users removed.');
        
        console.log('📝 Creating fresh users...');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        
        // Create fresh users
        const users = await User.bulkCreate([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                isActive: true
            },
            {
                name: 'Staff User',
                email: 'staff@example.com',
                password: hashedPassword,
                role: 'staff',
                isActive: true
            }
        ]);
        
        console.log(`✅ Created ${users.length} users successfully!`);
        console.log('   👤 Admin: admin@example.com / admin123');
        console.log('   👤 Staff: staff@example.com / admin123');

        // ✅ AUTO-SEED CATEGORIES
        console.log('📝 Checking categories...');
        const categoryCount = await Category.count();
        if (categoryCount === 0) {
            console.log('📝 Creating default categories...');
            await Category.bulkCreate([
                { name: 'Electronics', description: 'Electronic devices and accessories' },
                { name: 'Clothing', description: 'Apparel and fashion items' },
                { name: 'Books', description: 'Books and educational materials' },
                { name: 'Home & Garden', description: 'Home decor and garden supplies' }
            ]);
            console.log('✅ Categories created!');
        } else {
            console.log(`✅ ${categoryCount} categories already exist.`);
        }

        // ✅ AUTO-SEED PRODUCTS
        console.log('📝 Checking products...');
        const productCount = await Product.count();
        if (productCount === 0) {
            console.log('📝 Creating default products...');
            const categories = await Category.findAll();
            if (categories.length > 0) {
                await Product.bulkCreate([
                    { name: 'Smartphone X', price: 699.99, stockQuantity: 50, sku: 'PHONE-001', categoryId: categories[0].id, lowStockThreshold: 10 },
                    { name: 'Laptop Pro', price: 1299.99, stockQuantity: 30, sku: 'LAPTOP-001', categoryId: categories[0].id, lowStockThreshold: 5 },
                    { name: 'T-Shirt', price: 29.99, stockQuantity: 100, sku: 'CLOTH-001', categoryId: categories[1].id, lowStockThreshold: 20 },
                    { name: 'Programming Book', price: 49.99, stockQuantity: 75, sku: 'BOOK-001', categoryId: categories[2].id, lowStockThreshold: 15 }
                ]);
                console.log('✅ Products created!');
            }
        } else {
            console.log(`✅ ${productCount} products already exist.`);
        }

        console.log('✅ Database initialization complete!');
        console.log('🔐 You can now login with: admin@example.com / admin123');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('❌ Full error:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };