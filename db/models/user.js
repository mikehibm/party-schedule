'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 50],
        },
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 200],
        },
        set(value) {
          this.setDataValue('password', User.hashPwd(value));
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'users',
      validate: {
        //
        // User's email must be unique.
        isEmailUnique(next) {
          (async user => {
            const { id, email } = user;
            const existing = await User.findAll({
              where: {
                email,
                id: { [Op.ne]: id },
              },
            });

            if (existing.length > 0) {
              next('The same email address already exists.');
              return;
            }
            next();
          })(this);
        },
      },
    }
  );
  User.associate = function(models) {
    // associations can be defined here
  };

  User.hashPwd = function(s) {
    if (!s) return s;
    const shasum = crypto.createHash('sha1');
    shasum.update(s);
    return shasum.digest('hex');
  };

  return User;
};
