'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING(50),
      email: DataTypes.STRING(300),
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
