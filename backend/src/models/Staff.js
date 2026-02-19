// backend/src/models/Staff.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Staff = sequelize.define('Staff', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `s${Date.now()}-${uuidv4().substr(0, 4)}`
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    sub_department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'sub_departments',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    hourly_rate_currency: {
        type: DataTypes.ENUM('USD', 'TZS', 'EUR', 'GBP', 'KES', 'UGX'),
        defaultValue: 'USD'
    },
    hire_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    target_hours: {
        type: DataTypes.INTEGER,
        defaultValue: 160
    }
}, {
    tableName: 'staff',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['email']
        },
        {
            fields: ['status']
        }
    ]
});

module.exports = Staff;