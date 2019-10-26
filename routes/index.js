var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const dayHeaders = [
    { name: 'Sun', weekend: true },
    { name: 'Mon' },
    { name: 'Tue' },
    { name: 'Wed' },
    { name: 'Thu' },
    { name: 'Fri' },
    { name: 'Sat', weekend: true },
  ];
  let year = req.query['y'] - 0;
  let month = req.query['m'] - 0;

  if (isNaN(year)) year = new Date().getFullYear();
  if (isNaN(month)) month = new Date().getMonth() + 1;

  const startDate = new Date(year, month - 1, 1);
  startDate.setDate(1 - startDate.getDay());

  const days = [];
  const d = startDate;
  for (let i = 0; i < 35; i++) {
    const day = {
      date: d,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month - 1,
    };
    days.push(day);
    d.setDate(d.getDate() + 1);
  }

  res.render('index', {
    title: 'Schedule',
    dayHeaders,
    days,
    year,
    month,
    prevYear: month > 1 ? year : year - 1,
    nextYear: month < 12 ? year : year + 1,
    prevMonth: month > 1 ? month - 1 : 12,
    nextMonth: month < 12 ? month + 1 : 1,
  });
});

module.exports = router;
