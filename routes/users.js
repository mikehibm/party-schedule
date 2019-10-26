var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const users = [
    { id: 1, name: 'AA AA', email: 'fasdfsa@gmail.com' },
    { id: 2, name: 'BBB BMBMBM', email: 'bbbbb@bbb.com' },
    { id: 3, name: 'CCCCCC', email: 'cococo@.co.jp' },
  ];

  //  res.send('respond with a resource');
  res.json(users);
});

module.exports = router;
