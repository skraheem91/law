// backend/src/models/RetainerScope.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const RetainerScope = sequelize.define('RetainerScope', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `scope${Date.now()}-${uuidv4().substr(0, 4)}`
    },
    retainer_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'retainers',
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
    billing_method: {
        type: DataTypes.ENUM('Fixed', 'Hourly', 'Percentage'),
        allowNull: false
    },
    allocated_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    utilized_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    allocated_hours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    utilized_hours: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    extension_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('Active', 'Completed', 'Suspended'),
        defaultValue: 'Active'
    }
}, {
    tableName: 'retainer_scopes',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['retainer_id']
        }
    ]
});

// Virtual field: balance_amount
RetainerScope.prototype.getBalanceAmount = function() {
    return parseFloat(this.allocated_amount) - parseFloat(this.utilized_amount);
};

// Virtual field: hours_remaining
RetainerScope.prototype.getHoursRemaining = function() {
    if (!this.allocated_hours) return null;
    return parseFloat(this.allocated_hours) - parseFloat(this.utilized_hours);
};

module.exports = RetainerScope;