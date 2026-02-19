// backend/scripts/seed.js

require('dotenv').config();
const { sequelize, User, Staff, Client, Retainer, Case, Task } = require('../src/models');
const { logger } = require('../src/utils/logger');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        logger.info('🌱 Starting database seeding...');

        // Check if data already exists
        const userCount = await User.count();
        if (userCount > 0) {
            logger.info('✅ Database already seeded');
            process.exit(0);
        }

        // Start transaction
        await sequelize.transaction(async (t) => {
            logger.info('📝 Creating users...');

            // Create admin user
            const admin = await User.create({
                username: 'admin',
                email: 'admin@lawfirm.com',
                password_hash: 'Admin@123',
                role: 'superadmin',
                is_active: true
            }, { transaction: t });

            // Create partner user
            const partner = await User.create({
                username: 'sarah.johnson',
                email: 'sarah.johnson@lawfirm.com',
                password_hash: 'Partner@123',
                role: 'partner',
                is_active: true
            }, { transaction: t });

            // Create advocate users
            const advocate1 = await User.create({
                username: 'michael.chen',
                email: 'michael.chen@lawfirm.com',
                password_hash: 'Advocate@123',
                role: 'advocate',
                is_active: true
            }, { transaction: t });

            const advocate2 = await User.create({
                username: 'emily.rodriguez',
                email: 'emily.rodriguez@lawfirm.com',
                password_hash: 'Advocate@123',
                role: 'advocate',
                is_active: true
            }, { transaction: t });

            const advocate3 = await User.create({
                username: 'david.kim',
                email: 'david.kim@lawfirm.com',
                password_hash: 'Advocate@123',
                role: 'advocate',
                is_active: true
            }, { transaction: t });

            const paralegal = await User.create({
                username: 'jessica.martinez',
                email: 'jessica.martinez@lawfirm.com',
                password_hash: 'Paralegal@123',
                role: 'paralegal',
                is_active: true
            }, { transaction: t });

            logger.info('✅ Users created');

            // Create staff records
            logger.info('📝 Creating staff records...');

            await Staff.create({
                user_id: partner.id,
                name: 'Sarah Johnson',
                email: 'sarah.johnson@lawfirm.com',
                phone: '+255 718 901 234',
                role: 'Senior Partner',
                department: 'Corporate Law',
                status: 'Active',
                hourly_rate: 350,
                hourly_rate_currency: 'USD',
                hire_date: '2015-03-15',
                target_hours: 160
            }, { transaction: t });

            await Staff.create({
                user_id: advocate1.id,
                name: 'Michael Chen',
                email: 'michael.chen@lawfirm.com',
                phone: '+255 719 012 345',
                role: 'Senior Associate',
                department: 'Litigation',
                status: 'Active',
                hourly_rate: 400,
                hourly_rate_currency: 'USD',
                hire_date: '2017-06-01',
                target_hours: 160
            }, { transaction: t });

            await Staff.create({
                user_id: advocate2.id,
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@lawfirm.com',
                phone: '+255 720 123 456',
                role: 'Associate',
                department: 'Intellectual Property',
                status: 'Active',
                hourly_rate: 900000,
                hourly_rate_currency: 'TZS',
                hire_date: '2019-09-15',
                target_hours: 160
            }, { transaction: t });

            await Staff.create({
                user_id: advocate3.id,
                name: 'David Kim',
                email: 'david.kim@lawfirm.com',
                phone: '+255 721 234 567',
                role: 'Associate',
                department: 'Tax Law',
                status: 'Active',
                hourly_rate: 300,
                hourly_rate_currency: 'USD',
                hire_date: '2020-01-10',
                target_hours: 160
            }, { transaction: t });

            await Staff.create({
                user_id: paralegal.id,
                name: 'Jessica Martinez',
                email: 'jessica.martinez@lawfirm.com',
                phone: '+255 722 345 678',
                role: 'Paralegal',
                department: 'Corporate Law',
                status: 'Active',
                hourly_rate: 600000,
                hourly_rate_currency: 'TZS',
                hire_date: '2021-04-20',
                target_hours: 160
            }, { transaction: t });

            logger.info('✅ Staff created');

            // Create clients
            logger.info('📝 Creating clients...');

            const client1 = await Client.create({
                name: 'TechCorp Industries',
                type: 'Corporate',
                email: 'contact@techcorp.com',
                phone: '+255 712 345 678',
                address: '123 Business St, Dar es Salaam',
                industry: 'Technology',
                status: 'Active',
                preferred_currency: 'USD',
                created_by: admin.id
            }, { transaction: t });

            const client2 = await Client.create({
                name: 'InnovateTech Solutions',
                type: 'Corporate',
                email: 'info@innovatetech.com',
                phone: '+255 713 456 789',
                address: '456 Innovation Ave, Dar es Salaam',
                industry: 'Technology',
                status: 'Active',
                preferred_currency: 'TZS',
                created_by: admin.id
            }, { transaction: t });

            const client3 = await Client.create({
                name: 'Smith Family Trust',
                type: 'Individual',
                email: 'smith.trust@email.com',
                phone: '+255 714 567 890',
                address: '789 Trust Lane, Arusha',
                industry: 'Estate Planning',
                status: 'Active',
                preferred_currency: 'TZS',
                created_by: admin.id
            }, { transaction: t });

            logger.info('✅ Clients created');

            // Create retainers
            logger.info('📝 Creating retainers...');

            const retainer1 = await Retainer.create({
                client_id: client1.id,
                name: 'Annual Corporate Retainer',
                type: 'General',
                billing_type: 'Mixed',
                total_amount: 50000,
                currency: 'USD',
                utilized_amount: 0,
                total_hours_allocated: 100,
                hours_utilized: 0,
                start_date: '2024-01-01',
                end_date: '2024-12-31',
                auto_renew: true,
                status: 'Active'
            }, { transaction: t });

            const retainer2 = await Retainer.create({
                client_id: client2.id,
                name: 'IP Services Retainer',
                type: 'Specific',
                billing_type: 'Hourly',
                total_amount: 30000,
                currency: 'USD',
                utilized_amount: 0,
                total_hours_allocated: 60,
                hours_utilized: 0,
                start_date: '2024-10-01',
                end_date: '2025-03-31',
                auto_renew: false,
                status: 'Active'
            }, { transaction: t });

            logger.info('✅ Retainers created');

            // Create cases
            logger.info('📝 Creating cases...');

            const case1 = await Case.create({
                case_reference: 'TC-2024-001',
                client_id: client1.id,
                retainer_id: retainer1.id,
                title: 'Software Licensing Agreement Review',
                description: 'Review and negotiate terms for enterprise software licensing',
                practice_area: 'Corporate Law',
                priority: 'High',
                status: 'In Progress',
                start_date: '2024-01-10',
                deadline: '2024-02-15',
                created_by: partner.id
            }, { transaction: t });

            const case2 = await Case.create({
                case_reference: 'TC-2024-002',
                client_id: client1.id,
                retainer_id: retainer1.id,
                title: 'Contract Dispute Resolution',
                description: 'Vendor contract dispute requiring litigation',
                practice_area: 'Litigation',
                priority: 'Urgent',
                status: 'Open',
                start_date: '2024-02-01',
                deadline: '2024-04-30',
                created_by: partner.id
            }, { transaction: t });

            logger.info('✅ Cases created');

            // Create tasks
            logger.info('📝 Creating tasks...');

            await Task.create({
                client_id: client1.id,
                case_id: case1.id,
                title: 'Review software license terms',
                description: 'Analyze terms and conditions of the proposed licensing agreement',
                task_type: 'Drafting',
                priority: 'High',
                status: 'In Progress',
                due_date: '2024-01-25',
                billable: true,
                hourly_rate: 350,
                hourly_rate_currency: 'USD',
                time_spent_minutes: 180,
                billable_amount: 1050
            }, { transaction: t });

            await Task.create({
                client_id: client1.id,
                case_id: case2.id,
                title: 'Draft response to vendor claim',
                description: 'Prepare legal response to contract dispute claim',
                task_type: 'Drafting',
                priority: 'Urgent',
                status: 'In Progress',
                due_date: '2024-02-05',
                billable: true,
                hourly_rate: 400,
                hourly_rate_currency: 'USD',
                time_spent_minutes: 240,
                billable_amount: 1600
            }, { transaction: t });

            logger.info('✅ Tasks created');

            logger.info('🎉 Database seeding completed successfully!');
        });

        process.exit(0);
    } catch (error) {
        logger.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();