// backend/src/models/Task.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `t${Date.now()}-${uuidv4().substr(0, 4)}`
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
    retainer_scope_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        references: {
            model: 'retainer_scopes',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    task_type: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
        defaultValue: 'Pending'
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    billable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    hourly_rate_currency: {
        type: DataTypes.ENUM('USD', 'TZS', 'EUR', 'GBP', 'KES', 'UGX'),
        defaultValue: 'USD'
    },
    time_spent_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    billable_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['client_id']
        },
        {
            fields: ['case_id']
        },
        {
            fields: ['status']
        }
    ]
});

module.exports = Task;