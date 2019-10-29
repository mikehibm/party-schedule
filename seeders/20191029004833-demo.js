'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Demo User',
          email: 'demo@demo.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'AAA aaaa',
          email: 'aaa@demo.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'BBBBB',
          email: 'bbbbb@demo.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
