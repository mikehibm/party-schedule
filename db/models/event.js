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
        //
        // Start time must be earlier than End time.
        startTimeAndEndTime() {
          if (this.startTime >= this.endTime) {
            throw new Error('Start time must be earlier than End time.');
          }
        },
        //
        // Events must not overwrap each other.
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
        //
        // 1. If updating an available block (white),
        //  check it has existing events (yellow) within its time range and verify the new time range contains all the existing events.
        // 2. If updateing a booked event (yellow),
        //  verify that it is within an available block (white).
        availableBlock(next) {
          if (this.available) {
            (async event => {
              const {
                id,
                startTime,
                endTime,
                available,
              } = event._previousDataValues;
              const where = {
                startTime: { [Op.gte]: startTime },
                endTime: { [Op.lte]: endTime },
                available: { [Op.eq]: false },
                id: { [Op.ne]: id },
              };
              const minStartTime = await Event.min('startTime', { where });
              const maxEndTime = await Event.max('endTime', { where });

              if (!minStartTime && !maxEndTime) {
                next();
                return;
              }

              if (
                minStartTime < event.startTime ||
                maxEndTime > event.endTime
              ) {
                next(
                  'Cannot update this block because existing events will be out of available time range. Please modify existing events first.'
                );
                return;
              }
              next();
            })(this);
          } else {
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
          }
        },
      },
      hooks: {
        //
        // Make sure that an available block (white) is not deleted
        // when it has booked events (yellow) within its time range.
        beforeDestroy: async (event, options) => {
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
