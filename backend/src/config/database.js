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
        
        await sequelize.sync({ force: true }); // ✅ Drop and recreate tables
        console.log('✅ All models synchronized!');

        // ============================================
        // ✅ SEED IN CORRECT ORDER
        // ============================================

        // Step 1: Create Users
        console.log('📝 Creating users...');
        const hashedPassword = await bcrypt.hash('admin123', 12);
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
        console.log(`✅ Created ${users.length} users`);

        // Step 2: Create Categories
        console.log('📝 Creating categories...');
        const categories = await Category.bulkCreate([
            { name: 'Electronics', description: 'Electronic devices and accessories' },
            { name: 'Clothing', description: 'Apparel and fashion items' },
            { name: 'Books', description: 'Books and educational materials' },
            { name: 'Home & Garden', description: 'Home decor and garden supplies' }
        ]);
        console.log(`✅ Created ${categories.length} categories`);

        // Step 3: Create Products (with valid categoryId)
        console.log('📝 Creating products...');
        const products = await Product.bulkCreate([
            { name: 'Smartphone X', price: 699.99, stockQuantity: 50, sku: 'PHONE-001', categoryId: categories[0].id, lowStockThreshold: 10 },
            { name: 'Laptop Pro', price: 1299.99, stockQuantity: 30, sku: 'LAPTOP-001', categoryId: categories[0].id, lowStockThreshold: 5 },
            { name: 'T-Shirt', price: 29.99, stockQuantity: 100, sku: 'CLOTH-001', categoryId: categories[1].id, lowStockThreshold: 20 },
            { name: 'Programming Book', price: 49.99, stockQuantity: 75, sku: 'BOOK-001', categoryId: categories[2].id, lowStockThreshold: 15 }
        ]);
        console.log(`✅ Created ${products.length} products`);

        console.log('✅ Database initialization complete!');
        console.log('🔐 Login: admin@example.com / admin123');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('❌ Full error:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };