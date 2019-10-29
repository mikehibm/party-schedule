'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Events',
      [
        {
          startTime: new Date('2019-10-28 13:00'),
          endTime: new Date('2019-10-28 18:00'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('2019-10-29 10:00'),
          endTime: new Date('2019-10-29 18:00'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('2019-10-31 10:00'),
          endTime: new Date('2019-10-31 20:00'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('2019-11-03 10:00'),
          endTime: new Date('2019-11-03 20:00'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('2019-11-05 10:00'),
          endTime: new Date('2019-11-05 20:00'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('2019-11-06 10:00'),
          endTime: new Date('2019-11-06 20:00'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', null, {});
  },
};
