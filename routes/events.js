const express = require('express');
const router = express.Router();

const db = require('../db/models');

/* GET users listing. */
router.get('/', (req, res) => {
  db.Event.findAll().then(list => {
    if (!list) {
      console.log('Eventsデータを取得できませんでした。');
      res.status(500).send('Error');
    } else {
      res.json(list);
    }
  });
});

router.get('/:year/:month/:day', (req, res) => {
  const { year, month, day } = req.params;
  console.log(`Date = ${year}-${month}-${day}`);

  const times = [
    { label: '08', startTime: '08:00', endTime: '08:30', available: false, id: 0 },
    { label: '', startTime: '08:30', endTime: '09:00', available: false, id: 0 },
    { label: '09', startTime: '09:00', endTime: '09:30', available: true, id: 1 },
    { label: '', startTime: '09:30', endTime: '10:00', available: true, id: 1 },
  ];

  res.render('events', {
    title: `Events - ${month}/${day}/${year}`,
    year,
    month,
    day,
    times,
  });
});

module.exports = router;
