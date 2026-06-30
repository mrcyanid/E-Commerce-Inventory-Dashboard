const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite'),
    logging: false,
    define: {
        timestamps: true
    }
});

const User = require('../models/User');

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite3 database connected successfully!');
        
        await sequelize.sync({ alter: true });
        console.log('✅ All models synchronized!');

        // ✅ AUTO-SEED USERS
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('📝 Seeding initial users...');
            
            const hashedPassword = await bcrypt.hash('admin123', 12);
            
            await User.bulkCreate([
                {
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: hashedPassword,
                    role: 'admin'
                },
                {
                    name: 'Staff User',
                    email: 'staff@example.com',
                    password: hashedPassword,
                    role: 'staff'
                }
            ]);
            
            console.log('✅ Users created successfully!');
            console.log('   👤 Admin: admin@example.com / admin123');
            console.log('   👤 Staff: staff@example.com / admin123');
        }

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};
// Seed function for initial data
const seedDatabase = async () => {
    const { User, Category, Product, Order } = require('../models');
    const bcrypt = require('bcryptjs');
    
    // Create categories
    const categories = await Category.bulkCreate([
        { name: 'Electronics', description: 'Electronic devices and accessories' },
        { name: 'Clothing', description: 'Apparel and fashion items' },
        { name: 'Books', description: 'Books and educational materials' },
        { name: 'Home & Garden', description: 'Home decor and garden supplies' }
    ]);
    
    // Create users (password: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const users = await User.bulkCreate([
        { 
            name: 'Admin User', 
            email: 'admin@example.com', 
            password: hashedPassword, 
            role: 'admin' 
        },
        { 
            name: 'Staff User', 
            email: 'staff@example.com', 
            password: hashedPassword, 
            role: 'staff' 
        }
    ]);
    
    // Create products
    const products = await Product.bulkCreate([
        {
            name: 'Smartphone X',
            description: 'Latest 5G smartphone with 128GB storage',
            price: 699.99,
            stockQuantity: 50,
            sku: 'PHONE-001',
            categoryId: categories[0].id,
            lowStockThreshold: 10
        },
        {
            name: 'Laptop Pro',
            description: 'High-performance laptop with 16GB RAM',
            price: 1299.99,
            stockQuantity: 30,
            sku: 'LAPTOP-001',
            categoryId: categories[0].id,
            lowStockThreshold: 5
        },
        {
            name: 'T-Shirt',
            description: 'Comfortable cotton t-shirt',
            price: 29.99,
            stockQuantity: 100,
            sku: 'CLOTH-001',
            categoryId: categories[1].id,
            lowStockThreshold: 20
        },
        {
            name: 'Programming Book',
            description: 'Learn Python programming',
            price: 49.99,
            stockQuantity: 75,
            sku: 'BOOK-001',
            categoryId: categories[2].id,
            lowStockThreshold: 15
        },
        {
            name: 'Wireless Headphones',
            description: 'Noise-cancelling bluetooth headphones',
            price: 199.99,
            stockQuantity: 45,
            sku: 'AUDIO-001',
            categoryId: categories[0].id,
            lowStockThreshold: 8
        },
        {
            name: 'Coffee Mug',
            description: 'Ceramic coffee mug with lid',
            price: 14.99,
            stockQuantity: 200,
            sku: 'HOME-001',
            categoryId: categories[3].id,
            lowStockThreshold: 30
        }
    ]);
    
    // Create orders
    await Order.bulkCreate([
        {
            orderNumber: 'ORD-001',
            userId: users[0].id,
            totalAmount: 729.98,
            status: 'delivered',
            shippingAddress: '123 Main St, Hyderabad',
            paymentStatus: 'completed',
            items: JSON.stringify([
                { productId: products[0].id, quantity: 1, price: 699.99 },
                { productId: products[2].id, quantity: 1, price: 29.99 }
            ])
        },
        {
            orderNumber: 'ORD-002',
            userId: users[0].id,
            totalAmount: 1299.99,
            status: 'processing',
            shippingAddress: '456 Park Ave, Hyderabad',
            paymentStatus: 'pending',
            items: JSON.stringify([
                { productId: products[1].id, quantity: 1, price: 1299.99 }
            ])
        },
        {
            orderNumber: 'ORD-003',
            userId: users[1].id,
            totalAmount: 79.98,
            status: 'shipped',
            shippingAddress: '789 Lake Rd, Hyderabad',
            paymentStatus: 'completed',
            items: JSON.stringify([
                { productId: products[2].id, quantity: 2, price: 29.99 },
                { productId: products[5].id, quantity: 1, price: 14.99 }
            ])
        }
    ]);
    
    console.log('✅ Seed data created successfully!');
};

module.exports = { sequelize, connectDB };