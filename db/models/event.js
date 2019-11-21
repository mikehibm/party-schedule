'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./');

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: { isDate: true },
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: { isDate: true },
      },
      available: { type: DataTypes.BOOLEAN, allowNull: false },
      note: { type: DataTypes.STRING(1000), validate: { len: [0, 1000] } },
    },
    {
      freezeTableName: true,
      tableName: 'events',
      validate: {
        startTimeAndEndTime() {
          if (this.startTime >= this.endTime) {
            throw new Error('Start time must be earlier than End time.');
          }
        },
        overwrappedTime(next) {
          (async event => {
            const { id, startTime, endTime, available } = event;
            const overwrapped = await Event.findAll({
              where: {
                // Replace 'lt' to 'lte' and 'gt' to 'gte' if you need to disallow adjacent events.
                startTime: { [Op.lt]: endTime },
                endTime: { [Op.gt]: startTime },
                available: { [Op.eq]: available },
                id: { [Op.ne]: id },
              },
            });

            if (overwrapped.length > 0) {
              next('Overwrapped events already exist.');
              return;
            }
            next();
          })(this);
        },
        availableBlock(next) {
          if (this.available == true) {
            next();
            return;
          }

          (async event => {
            const { id, startTime, endTime, available } = event;
            const availableBlock = await Event.findAll({
              where: {
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gte]: endTime },
                available: { [Op.eq]: true },
                id: { [Op.ne]: id },
              },
            });

            if (availableBlock.length === 0) {
              next('Specified time range is not available.');
              return;
            }
            next();
          })(this);
        },
      },
      hooks: {
        beforeDestroy: async (event, options) => {
          console.log('beforeDestroy: ', event, options);

          if (!event.available) {
            return;
          }

          const { id, startTime, endTime, available } = event;
          const bookedEvents = await Event.findAll({
            where: {
              startTime: { [Op.gte]: startTime },
              endTime: { [Op.lte]: endTime },
              available: { [Op.eq]: false },
              id: { [Op.ne]: id },
            },
          });

          if (bookedEvents.length !== 0) {
            throw new Error(
              'Cannot delete this block because it has one or more booked events.'
            );
          }
        },
      },
    }
  );
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
