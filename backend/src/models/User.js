const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// ✅ Don't import sequelize directly - export a function that takes it
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 50]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100]
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'staff'),
            defaultValue: 'staff'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            }
        }
    });

    // ✅ Add comparePassword method
    User.prototype.comparePassword = async function(candidatePassword) {
        try {
            return await bcrypt.compare(candidatePassword, this.password);
        } catch (error) {
            console.error('Password comparison error:', error);
            return false;
        }
    };

    return User;
};