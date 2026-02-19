// backend/src/models/Client.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `c${Date.now()}-${uuidv4().substr(0, 4)}`
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    type: {
        type: DataTypes.ENUM('Corporate', 'Individual', 'NGO', 'Government'),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT
    },
    industry: {
        type: DataTypes.STRING(100)
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
    },
    preferred_currency: {
        type: DataTypes.ENUM('USD', 'TZS', 'EUR', 'GBP', 'KES', 'UGX'),
        defaultValue: 'TZS'
    },
    created_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'clients',
    timestamps: true,
    underscored: true
});

module.exports = Client;