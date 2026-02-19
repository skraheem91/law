// backend/src/models/Retainer.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Retainer = sequelize.define('Retainer', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `ret${Date.now()}-${uuidv4().substr(0, 4)}`
    },
    client_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    type: {
        type: DataTypes.ENUM('General', 'Specific', 'Hybrid'),
        allowNull: false
    },
    billing_type: {
        type: DataTypes.ENUM('Fixed', 'Hourly', 'Mixed'),
        allowNull: false
    },
    total_amount: {
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
    utilized_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    total_hours_allocated: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    hours_utilized: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    auto_renew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('Active', 'Expiring Soon', 'Expired', 'Suspended'),
        defaultValue: 'Active'
    },
    expiry_alert_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'retainers',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['client_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['end_date']
        }
    ]
});

// Virtual field: balance_amount
Retainer.prototype.getBalanceAmount = function() {
    return parseFloat(this.total_amount) - parseFloat(this.utilized_amount);
};

// Virtual field: hours_remaining
Retainer.prototype.getHoursRemaining = function() {
    if (!this.total_hours_allocated) return null;
    return parseFloat(this.total_hours_allocated) - parseFloat(this.hours_utilized);
};

module.exports = Retainer;