const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/models/');

/* GET home page. */
router.get('/', async function(req, res) {
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

  const beginDate = startDate;
  const endDate = new Date(beginDate).setDate(beginDate.getDate() + 7 * 5);
  const events = await db.Event.findAll({
    where: {
      startTime: { [Op.gte]: beginDate, [Op.lt]: endDate },
    },
    order: ['startTime', 'endTime'],
    raw: true,
  });
  console.log(events);

  const days = [];
  const d = startDate;
  for (let i = 0; i < 35; i++) {
    const available =
      events.filter(
        i => new Date(i.startTime) >= d && new Date(i.endTime) < new Date(new Date(d).setDate(d.getDate() + 1))
      ).length > 0;

    const day = {
      date: d,
      year,
      month,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month - 1,
      available,
    };
    days.push(day);
    d.setDate(d.getDate() + 1);
  }

  res.render('index', {
    title: `Schedule - ${month}/${year}`,
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
