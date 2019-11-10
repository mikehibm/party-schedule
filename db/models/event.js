'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./');

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      startTime: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
      endTime: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
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
      },
    }
  );
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
