const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/models');
const { DateTime } = require('luxon');
const auth = require('./auth-helper');

// Get events
//   d=yyyy-MM-dd
//   id=999
router.get('/', auth, async (req, res) => {
  try {
    let where = {};

    const date = DateTime.fromSQL(req.query['d']);
    if (date.isValid) {
      where = {
        ...where,
        startTime: { [Op.gte]: date.toJSDate() },
        endTime: { [Op.lt]: date.plus({ days: 1 }).toJSDate() },
      };
    }

    const id = req.query['id'] | 0;
    if (id) {
      where = { ...where, id };
    }

    const list = await db.Event.findAll({
      where,
      order: [
        ['available', 'DESC'],
        ['startTime', 'ASC'],
      ],
    });

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error ${error.message}`);
    return;
  }
});

router.get('/:year/:month/:day', auth, async (req, res) => {
  const year = req.params.year | 0;
  const month = req.params.month | 0;
  const day = req.params.day | 0;

  const startOfDay = DateTime.local(year, month, day);
  const endOfDay = DateTime.local(year, month, day + 1);
  const times = [];

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
      where: {
        startTime: { [Op.gte]: startOfDay.toJSDate() },
        endTime: { [Op.lt]: endOfDay.toJSDate() },
      },
      order: [
        ['available', 'DESC'],
        ['startTime', 'ASC'],
      ],
    });

    for (const e of events) {
      const eventStartTimeStr = DateTime.fromSQL(e.startTime).toFormat('HH:mm');
      const eventEndTimeStr = DateTime.fromSQL(e.endTime).toFormat('HH:mm');
      const filteredTimes = times.filter(
        t => t.startTime >= eventStartTimeStr && t.endTime <= eventEndTimeStr
      );
      for (const t of filteredTimes) {
        t.available = e.available;
        t.id = e.id;
        t.booked = !e.available;
        t.first = !e.available && t.startTime === eventStartTimeStr;
        t.last = !e.available && t.endTime === eventEndTimeStr;
      }
    }

    const timesForSelect = times.filter(t => t.id !== 0);

    res.render('events', {
      title: `${month}/${day}/${year}`,
      year,
      month,
      day,
      date: startOfDay.toFormat('yyyy-MM-dd'),
      times,
      timesForSelect,
      events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error ${error.message}`);
    return;
  }
});

router.post('/:id', auth, async (req, res) => {
  const event = req.body;
  event.id = req.params['id'] | 0;

  try {
    let saveData = db.Event.build({ available: false });
    if (event.id) {
      saveData = await db.Event.findByPk(event.id);
      if (!saveData) {
        res.status(404).json({ result: 'error', message: 'Not found' });
        return;
      }
    }
    saveData.startTime = DateTime.fromSQL(`${event.startTime}`).toJSDate();
    saveData.endTime = DateTime.fromSQL(`${event.endTime}`).toJSDate();
    saveData.note = event.note;

    const { id } = await saveData.save();
    const rtnEvent = await db.Event.findByPk(id);
    res.json(rtnEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: error.message });
    return;
  }
});

router.delete('/:id', auth, async (req, res) => {
  const id = req.params['id'] | 0;

  const existing = await db.Event.findByPk(id);
  if (!existing) {
    res.status(404).json({ result: 'error', message: 'Not found' });
    return;
  }

  try {
    existing.destroy();
    res.json({ result: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: error.message });
    return;
  }
});

module.exports = router;
