// backend/scripts/migrate.js

require('dotenv').config();
const { sequelize } = require('../src/models');
const { logger } = require('../src/utils/logger');
const mysql = require('mysql2/promise');

const createDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        logger.info(`✅ Database '${process.env.DB_NAME}' created or already exists`);

        await connection.end();
    } catch (error) {
        logger.error('❌ Failed to create database:', error);
        throw error;
    }
};

const migrate = async () => {
    try {
        logger.info('🚀 Starting database migration...');

        // Create database if it doesn't exist
        await createDatabase();

        // Sync all models
        await sequelize.sync({ alter: true });
        logger.info('✅ All models synchronized successfully');

        process.exit(0);
    } catch (error) {
        logger.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();