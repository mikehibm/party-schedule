const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/models');
const { DateTime } = require('luxon');

/* GET events */
router.get('/', async (req, res) => {
  try {
    const list = await db.Event.findAll();
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error ${error.message}`);
    return;
  }
});

router.get('/:year/:month/:day', async (req, res) => {
  const year = req.params.year | 0;
  const month = req.params.month | 0;
  const day = req.params.day | 0;
  console.log(`Date = ${year}-${month}-${day}`);

  const startOfDay = DateTime.local(year, month, day);
  const endOfDay = DateTime.local(year, month, day + 1);

  const times = [
    // { label: '08', startTime: '08:00', endTime: '08:30', available: false, id: 0 },
    // { label: '', startTime: '08:30', endTime: '09:00', available: false, id: 0 },
    // { label: '09', startTime: '09:00', endTime: '09:30', available: true, id: 0 },
    // { label: '', startTime: '09:30', endTime: '10:00', available: true, id: 0 },
  ];

  for (let i = 8; i < 21; i++) {
    const t = {
      label: '' + i,
      startTime: startOfDay.plus({ hours: i }).toFormat('HH:mm'),
      endTime: startOfDay.plus({ hours: i, minutes: 30 }).toFormat('HH:mm'),
      available: false,
      id: 0,
    };
    times.push(t);

    const t2 = {
      label: '',
      startTime: startOfDay.plus({ hours: i, minutes: 30 }).toFormat('HH:mm'),
      endTime: startOfDay.plus({ hours: i + 1 }).toFormat('HH:mm'),
      available: false,
      id: 0,
    };
    times.push(t2);
  }

  try {
    const events = await db.Event.findAll({
      where: { startTime: { [Op.gte]: startOfDay.toJSDate() }, endTime: { [Op.lt]: endOfDay.toJSDate() } },
      order: [['available', 'DESC'], ['startTime', 'ASC']],
    });

    for (const e of events) {
      const eventStartTimeStr = DateTime.fromSQL(e.startTime).toFormat('HH:mm');
      const eventEndTimeStr = DateTime.fromSQL(e.endTime).toFormat('HH:mm');
      const filteredTimes = times.filter(t => t.startTime >= eventStartTimeStr && t.endTime <= eventEndTimeStr);
      for (const t of filteredTimes) {
        t.available = e.available;
        t.id = e.id;
        t.booked = !e.available;
        t.first = t.startTime === eventStartTimeStr;
        t.last = t.endTime === eventEndTimeStr;
      }
    }

    res.render('events', {
      title: `Events - ${month}/${day}/${year}`,
      year,
      month,
      day,
      times,
      events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error ${error.message}`);
    return;
  }
});

module.exports = router;
