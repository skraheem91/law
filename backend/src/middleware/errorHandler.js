// backend/src/middleware/errorHandler.js

const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        user: req.user?.id
    });

    // 🔴 CRITICAL: Don't leak error details in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Default error
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || 'Internal Server Error';
    
    // Handle specific error types
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        errorMessage = err.errors.map(e => e.message).join(', ');
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        errorMessage = 'Duplicate entry';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorMessage = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        errorMessage = 'Token expired';
    }
    
    res.status(statusCode).json({
        success: false,
        message: errorMessage,
        ...(isProduction ? {} : { stack: err.stack })
    });
};

module.exports = errorHandler;