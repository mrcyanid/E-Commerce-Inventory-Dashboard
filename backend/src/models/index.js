const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Category = require('./Category');

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
    User,
    Product,
    Order,
    Category
};