// backend/src/config/database.js

const { Sequelize } = require('sequelize');
const { logger } = require('../utils/logger');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'legal_management',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: (msg) => logger.debug(msg),
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('✅ MySQL Database connected successfully');
        
        // Test connection
        await sequelize.query('SELECT 1+1 as result');
        logger.info('✅ Database query test passed');
        
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        throw error;
    }
};

module.exports = { sequelize, connectDB };