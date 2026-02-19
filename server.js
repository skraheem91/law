// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize, connectDB } = require('./src/config/database');
const { logger } = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const caseRoutes = require('./src/routes/caseRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const timeEntryRoutes = require('./src/routes/timeEntryRoutes');
const retainerRoutes = require('./src/routes/retainerRoutes');
const leaveRoutes = require('./src/routes/leaveRoutes');
const fundsRoutes = require('./src/routes/fundsRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');
const exchangeRateRoutes = require('./src/routes/exchangeRateRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

// 🔴 CRITICAL: Security middleware
app.use(helmet());

// 🔴 CRITICAL: CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

// 🔴 CRITICAL: Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// 🔴 CRITICAL: Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/retainers', retainerRoutes);
app.use('/api/leave-requests', leaveRoutes);
app.use('/api/funds-requests', fundsRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/exchange-rates', exchangeRateRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// 🔴 CRITICAL: Error handling middleware
app.use(errorHandler);

// 🔴 CRITICAL: Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();
        
        // Sync database in development only (don't use in production)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            logger.info('Database synced');
        }
        
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
            logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();