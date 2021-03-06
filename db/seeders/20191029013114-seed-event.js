'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'events',
      [
        {
          startTime: new Date('Oct 28 2019 13:00:00 GMT-1000'),
          endTime: new Date('Oct 28 2019 18:00:00 GMT-1000'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Oct 29 2019 09:00:00 GMT-1000'),
          endTime: new Date('Oct 29 2019 18:00:00 GMT-1000'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Oct 31 2019 09:00:00 GMT-1000'),
          endTime: new Date('Oct 31 2019 18:00:00 GMT-1000'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Nov 3 2019 10:00:00 GMT-1000'),
          endTime: new Date('Nov 3 2019 20:00:00 GMT-1000'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Nov 3 2019 10:30:00 GMT-1000'),
          endTime: new Date('Nov 3 2019 12:30:00 GMT-1000'),
          available: false,
          note: 'Yoshida Family <script>alert("Danger!!")</script>',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Nov 3 2019 17:00:00 GMT-1000'),
          endTime: new Date('Nov 3 2019 19:30:00 GMT-1000'),
          available: false,
          note: 'Mrs. Jhonson',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Nov 5 2019 10:00:00 GMT-1000'),
          endTime: new Date('Nov 5 2019 15:00:00 GMT-1000'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Nov 5 2019 13:00:00 GMT-1000'),
          endTime: new Date('Nov 5 2019 14:00:00 GMT-1000'),
          available: false,
          note: 'これはテストです',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Nov 6 2019 11:00:00 GMT-1000'),
          endTime: new Date('Nov 6 2019 19:00:00 GMT-1000'),
          available: true,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startTime: new Date('Nov 6 2019 15:30:00 GMT-1000'),
          endTime: new Date('Nov 6 2019 17:00:00 GMT-1000'),
          available: false,
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
