// backend/src/models/TimeEntry.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TimeEntry = sequelize.define('TimeEntry', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        defaultValue: () => `time${Date.now()}-${uuidv4().substr(0, 4)}`
    },
    task_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'tasks',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    billable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'time_entries',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['task_id']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['start_time']
        }
    ]
});

module.exports = TimeEntry;