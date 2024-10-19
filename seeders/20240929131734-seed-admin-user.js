// eslint-disable-next-line strict, lines-around-directive
'use strict';

const { logger } = require('../src/middlewares/logger');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'paAdmin'`,
    );

    if (!adminRole || adminRole.length === 0) {
      logger.error('Admin role not found. Make sure to run the roles seeder first.');
      return;
    }

    const adminRoleId = adminRole[0].id;

    const [existingAdmin] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email_id = 'admin@example.com'`,
    );

    if (existingAdmin && existingAdmin.length > 0) {
      logger.error('Admin user already exists. Skipping admin user creation.');
      return;
    }

    await queryInterface.bulkInsert('users', [{
      role_id: adminRoleId,
      mobile_number: '1234567890',
      email_id: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }], {});

    logger.info('Admin user created successfully.');
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email_id: 'admin@example.com' }, {});
  },
};
