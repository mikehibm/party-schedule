'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      available: DataTypes.BOOLEAN,
      note: DataTypes.STRING,
    },
    {}
  );
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
