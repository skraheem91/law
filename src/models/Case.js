// backend/src/models/Case.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Case = sequelize.define('Case', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `case${Date.now()}-${uuidv4().substr(0, 4)}`
    },
    case_reference: {
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
    retainer_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        references: {
            model: 'retainers',
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
    practice_area: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'departments',
            key: 'id'
        }
    },
    sub_department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'sub_departments',
            key: 'id'
        }
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Closed', 'On Hold'),
        defaultValue: 'Open'
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    closed_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
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
    tableName: 'cases',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['case_reference']
        },
        {
            fields: ['client_id']
        },
        {
            fields: ['status']
        }
    ]
});

module.exports = Case;