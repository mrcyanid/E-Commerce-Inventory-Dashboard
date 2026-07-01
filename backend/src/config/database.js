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

// ✅ Import models CORRECTLY
const User = require('../models/User')(sequelize);
const Product = require('../models/Product')(sequelize);
const Category = require('../models/Category')(sequelize);
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
        
        await sequelize.sync({ alter: true });
        console.log('✅ All models synchronized!');

        // ✅ Force seed users
        console.log('🔄 Checking users...');
        await User.destroy({ where: {} });
        console.log('✅ Existing users removed.');
        
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await User.bulkCreate([
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
        console.log('✅ Users created: admin@example.com / admin123');
        console.log('✅ Database initialization complete!');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };