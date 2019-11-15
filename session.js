const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/database.js')[env];

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
  host: config.host,
  port: 3306,
  user: config.username,
  password: config.password,
  database: config.database,
});

module.exports = session({
  key: 'mysession',
  secret: 'komfdahjkh434rewkjh3213',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
});
