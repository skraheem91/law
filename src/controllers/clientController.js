// backend/src/controllers/clientController.js

const { Client, Retainer, Case, sequelize } = require('../models');
const { logger } = require('../utils/logger');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
const getAllClients = async (req, res, next) => {
    try {
        const clients = await Client.findAll({
            include: [
                {
                    model: Retainer,
                    as: 'retainers',
                    limit: 1,
                    order: [['created_at', 'DESC']]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: clients
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const client = await Client.findByPk(id, {
            include: [
                {
                    model: Retainer,
                    as: 'retainers',
                    order: [['created_at', 'DESC']]
                },
                {
                    model: Case,
                    as: 'cases',
                    order: [['created_at', 'DESC']],
                    limit: 10
                }
            ]
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.json({
            success: true,
            data: client
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            name, type, email, phone, address, industry,
            retainerAmount, retainerCurrency, retainerType,
            retainerStartDate, retainerExpiryDate, hoursIncluded,
            servicesIncluded, notes
        } = req.body;

        // Validate required fields
        if (!name || !type || !email || !phone) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create client
        const client = await Client.create({
            name,
            type,
            email,
            phone,
            address,
            industry,
            status: 'Active',
            preferred_currency: retainerCurrency || 'TZS',
            created_by: req.user.id
        }, { transaction });

        // Create retainer if amount provided
        if (retainerAmount && retainerAmount > 0) {
            await Retainer.create({
                client_id: client.id,
                name: `${name} - Main Retainer`,
                type: 'General',
                billing_type: 'Mixed',
                total_amount: retainerAmount,
                currency: retainerCurrency || 'TZS',
                utilized_amount: 0,
                total_hours_allocated: hoursIncluded || null,
                hours_utilized: 0,
                start_date: retainerStartDate || new Date(),
                end_date: retainerExpiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                status: 'Active'
            }, { transaction });
        }

        await transaction.commit();

        // Fetch created client with relations
        const newClient = await Client.findByPk(client.id, {
            include: [{ model: Retainer, as: 'retainers' }]
        });

        logger.info(`Client created: ${client.name} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Client created successfully',
            data: newClient
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        await client.update(updates);

        logger.info(`Client updated: ${client.name} by user ${req.user.id}`);

        res.json({
            success: true,
            message: 'Client updated successfully',
            data: client
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        const client = await Client.findByPk(id);

        if (!client) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check for active cases
        const activeCases = await Case.count({
            where: {
                client_id: id,
                status: ['Open', 'In Progress']
            }
        });

        if (activeCases > 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot delete client with active cases'
            });
        }

        await client.destroy({ transaction });
        await transaction.commit();

        logger.info(`Client deleted: ${client.name} by user ${req.user.id}`);

        res.json({
            success: true,
            message: 'Client deleted successfully'
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};