'use strict';

const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
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
          isUnique: true,
        },
      },
      password: {
        type: DataTypes.STRING(20),
        validate: {
          len: [6, 20],
        },
        set(value) {
          this.setDataValue('password', User.hashPwd(value));
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'users',
    }
  );
  User.associate = function(models) {
    // associations can be defined here
  };

  User.hashPwd = function(s) {
    const shasum = crypto.createHash('sha1');
    shasum.update(s);
    return shasum.digest('hex');
  };

  return User;
};
