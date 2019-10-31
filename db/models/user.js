'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING(50),
      validate: {
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING(300),
      validate: {
        isEmail: true,
      },
    },
  }, 
  {
    freezeTableName: true,
    tableName: 'users',
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
