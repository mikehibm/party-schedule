module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_SERVER,
    dialect: 'mysql',
    dialectOptions: {
      // useUTC: false,
      dateStrings: true,
      typeCast: function(field, next) {
        // for reading from database
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
    timezone: '-10:00',
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_SERVER,
    dialect: 'mysql',
    dialectOptions: {
      // useUTC: false,
      dateStrings: true,
      typeCast: function(field, next) {
        // for reading from database
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
    timezone: '-10:00',
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_SERVER,
    dialect: 'mysql',
    dialectOptions: {
      // useUTC: false,
      dateStrings: true,
      typeCast: function(field, next) {
        // for reading from database
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
    timezone: '-10:00',
  },
};
