'use strict';

const db = require('../models/');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Demo User',
          email: 'demo@demo.com',
          password: db.User.hashPwd('demo'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'AAA aaaa',
          email: 'aaa@demo.com',
          password: db.User.hashPwd('demo'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'BBBBB',
          email: 'bbbbb@demo.com',
          password: db.User.hashPwd('demo'),
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
