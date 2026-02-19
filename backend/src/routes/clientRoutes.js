// backend/src/routes/clientRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const clientController = require('../controllers/clientController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const clientValidation = [
    body('name').notEmpty().trim(),
    body('type').isIn(['Corporate', 'Individual', 'NGO', 'Government']),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty()
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', authorize('superadmin', 'partner', 'admin'), validate(clientValidation), clientController.createClient);
router.put('/:id', authorize('superadmin', 'partner', 'admin'), validate(clientValidation), clientController.updateClient);
router.delete('/:id', authorize('superadmin'), clientController.deleteClient);

module.exports = router;