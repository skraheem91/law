// backend/src/models/Invoice.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `inv${Date.now()}-${uuidv4().substr(0, 4)}`
    },
    invoice_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    client_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    case_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        references: {
            model: 'cases',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    currency: {
        type: DataTypes.ENUM('USD', 'TZS', 'EUR', 'GBP', 'KES', 'UGX'),
        allowNull: false
    },
    amount_in_base: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Sent', 'Paid', 'Overdue'),
        defaultValue: 'Draft'
    },
    issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    paid_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['invoice_number']
        },
        {
            fields: ['client_id']
        },
        {
            fields: ['status']
        }
    ]
});

module.exports = Invoice;