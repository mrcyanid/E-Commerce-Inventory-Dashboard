const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite'),
    logging: false,
    define: {
        timestamps: true
    }
});

// ✅ Import models
const User = require('../models/User')(sequelize);
const Category = require('../models/Category')(sequelize);
const Product = require('../models/Product')(sequelize);
const Order = require('../models/Order')(sequelize);

// ✅ Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite3 database connected successfully!');
        console.log(`📁 Database file: ${process.env.DB_STORAGE || './database.sqlite'}`);
        
        // ✅ Force sync (drops and recreates tables)
        await sequelize.sync({ force: true });
        console.log('✅ All models synchronized!');

        // ============================================
        // ✅ CREATE USERS FIRST (MOST IMPORTANT)
        // ============================================
        console.log('📝 Creating users...');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        
        // ✅ Use raw SQL to create users (no foreign key issues)
        await sequelize.query(`
            INSERT INTO Users (name, email, password, role, isActive, createdAt, updatedAt)
            VALUES 
                ('Admin User', 'admin@example.com', '${hashedPassword}', 'admin', 1, datetime('now'), datetime('now')),
                ('Staff User', 'staff@example.com', '${hashedPassword}', 'staff', 1, datetime('now'), datetime('now'))
        `);
        console.log('✅ Users created: admin@example.com / admin123');

        // ============================================
        // ✅ CREATE CATEGORIES
        // ============================================
        console.log('📝 Creating categories...');
        await sequelize.query(`
            INSERT INTO Categories (name, description, isActive, createdAt, updatedAt)
            VALUES 
                ('Electronics', 'Electronic devices and accessories', 1, datetime('now'), datetime('now')),
                ('Clothing', 'Apparel and fashion items', 1, datetime('now'), datetime('now')),
                ('Books', 'Books and educational materials', 1, datetime('now'), datetime('now')),
                ('Home & Garden', 'Home decor and garden supplies', 1, datetime('now'), datetime('now'))
        `);
        console.log('✅ Categories created!');

        // ============================================
        // ✅ CREATE PRODUCTS (with valid categoryIds)
        // ============================================
        console.log('📝 Creating products...');
        await sequelize.query(`
            INSERT INTO Products (name, price, stockQuantity, sku, categoryId, lowStockThreshold, isActive, createdAt, updatedAt)
            VALUES 
                ('Smartphone X', 699.99, 50, 'PHONE-001', 1, 10, 1, datetime('now'), datetime('now')),
                ('Laptop Pro', 1299.99, 30, 'LAPTOP-001', 1, 5, 1, datetime('now'), datetime('now')),
                ('T-Shirt', 29.99, 100, 'CLOTH-001', 2, 20, 1, datetime('now'), datetime('now')),
                ('Programming Book', 49.99, 75, 'BOOK-001', 3, 15, 1, datetime('now'), datetime('now'))
        `);
        console.log('✅ Products created!');

        console.log('✅ Database initialization complete!');
        console.log('🔐 Login: admin@example.com / admin123');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('❌ Full error:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };