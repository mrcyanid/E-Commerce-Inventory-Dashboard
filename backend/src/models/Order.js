const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            defaultValue: 'pending'
        },
        items: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                try {
                    const raw = this.getDataValue('items');
                    return raw ? JSON.parse(raw) : [];
                } catch {
                    return [];
                }
            },
            set(value) {
                this.setDataValue('items', JSON.stringify(value));
            }
        }
    }, {
        timestamps: true
    });

    return Order;
};