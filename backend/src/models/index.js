// backend/src/models/index.js

const User = require('./User');
const Client = require('./Client');
const Retainer = require('./Retainer');
const RetainerScope = require('./RetainerScope');
const Case = require('./Case');
const Task = require('./Task');
const Staff = require('./Staff');
const TimeEntry = require('./TimeEntry');
const Invoice = require('./Invoice');
const sequelize = require('../config/database').sequelize;

// 🔴 CRITICAL: Define all associations

// User associations
User.hasMany(Client, { foreignKey: 'created_by', as: 'created_clients' });
User.hasMany(Case, { foreignKey: 'created_by', as: 'created_cases' });
User.hasMany(Invoice, { foreignKey: 'created_by', as: 'created_invoices' });
User.hasMany(TimeEntry, { foreignKey: 'user_id', as: 'time_entries' });
User.hasOne(Staff, { foreignKey: 'user_id', as: 'staff_profile' });

// Client associations
Client.hasMany(Retainer, { foreignKey: 'client_id', as: 'retainers' });
Client.hasMany(Case, { foreignKey: 'client_id', as: 'cases' });
Client.hasMany(Task, { foreignKey: 'client_id', as: 'tasks' });
Client.hasMany(Invoice, { foreignKey: 'client_id', as: 'invoices' });
Client.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Retainer associations
Retainer.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Retainer.hasMany(RetainerScope, { foreignKey: 'retainer_id', as: 'scopes' });
Retainer.hasMany(Case, { foreignKey: 'retainer_id', as: 'cases' });

// RetainerScope associations
RetainerScope.belongsTo(Retainer, { foreignKey: 'retainer_id', as: 'retainer' });
RetainerScope.hasMany(Task, { foreignKey: 'retainer_scope_id', as: 'tasks' });

// Case associations
Case.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Case.belongsTo(Retainer, { foreignKey: 'retainer_id', as: 'retainer' });
Case.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Case.hasMany(Task, { foreignKey: 'case_id', as: 'tasks' });
Case.hasMany(Invoice, { foreignKey: 'case_id', as: 'invoices' });

// Task associations
Task.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Task.belongsTo(Case, { foreignKey: 'case_id', as: 'case' });
Task.belongsTo(RetainerScope, { foreignKey: 'retainer_scope_id', as: 'retainer_scope' });
Task.hasMany(TimeEntry, { foreignKey: 'task_id', as: 'time_entries' });

// Staff associations
Staff.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// TimeEntry associations
TimeEntry.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });
TimeEntry.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Invoice associations
Invoice.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Invoice.belongsTo(Case, { foreignKey: 'case_id', as: 'case' });
Invoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = {
    User,
    Client,
    Retainer,
    RetainerScope,
    Case,
    Task,
    Staff,
    TimeEntry,
    Invoice,
    sequelize
};