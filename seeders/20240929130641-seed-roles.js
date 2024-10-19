/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line strict, lines-around-directive
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        role_name: 'paAdmin',
        role_desc: 'Administrator with full access',
      },
      {
        role_name: 'Patient',
        role_desc: 'Registered patient user',
      },
      {
        role_name: 'Provider',
        role_desc: 'Healthcare provider',
      },
      {
        role_name: 'Doctor',
        role_desc: 'Medical doctor',
      },
      {
        role_name: 'Staff',
        role_desc: 'Staff member with limited access',
      },
    ];

    for (const role of roles) {
      const existingRole = await queryInterface.rawSelect('roles', {
        where: {
          role_name: role.role_name,
        },
      }, ['id']);

      if (!existingRole) {
        await queryInterface.bulkInsert('roles', [{
          ...role,
          created_at: new Date(),
          updated_at: new Date(),
        }]);
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
