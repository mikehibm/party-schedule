const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/models');
const { DateTime } = require('luxon');

// Get events
//   d=yyyy-MM-dd
//   id=999
router.get('/', async (req, res) => {
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
      order: [['available', 'DESC'], ['startTime', 'ASC']],
    });

    setTimeout(() => {
      res.json(list);
    }, 400); // This delay is for testing purpose only.
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
        t.first = !e.available && t.startTime === eventStartTimeStr;
        t.last = !e.available && t.endTime === eventEndTimeStr;
      }
    }

    const timesForSelect = times.filter(t => t.id !== 0);

    res.render('events', {
      title: `Events - ${month}/${day}/${year}`,
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

router.post('/:year/:month/:day', async (req, res) => {
  const year = req.params.year | 0;
  const month = req.params.month | 0;
  const day = req.params.day | 0;
  const date = DateTime.local(year, month, day);
  const dateStr = date.toFormat('yyyy-MM-dd');
  const event = req.body;
  event.id = event.id | 0;

  if (event.button === 'delete') {
    return await deleteEvent(event, req, res);
  }

  try {
    let saveData = db.Event.build({ available: false });
    if (event.id) {
      saveData = await db.Event.findByPk(event.id);
      if (!saveData) {
        res.status(404).send('Not found');
        return;
      }
    }
    saveData.startTime = DateTime.fromSQL(`${dateStr} ${event.startTime}`).toJSDate();
    saveData.endTime = DateTime.fromSQL(`${dateStr} ${event.endTime}`).toJSDate();
    saveData.note = event.note;

    await checkDuplicate(saveData.id, saveData.startTime, saveData.endTime, saveData.available);

    await saveData.save();

    res.redirect(req.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
    return;
  }
});

async function checkDuplicate(id, startTime, endTime, available) {
  const duplicateEvents = await db.Event.findAll({
    where: {
      // Replace 'lt' to 'lte' and 'gt' to 'gte' if you need to disallow adjacent events.
      startTime: { [Op.lt]: endTime },
      endTime: { [Op.gt]: startTime },
      available: { [Op.eq]: available },
      id: { [Op.ne]: id },
    },
  });

  if (duplicateEvents.length > 0) {
    throw new Error('Duplicated events');
  }
}

async function deleteEvent(event, req, res) {
  const existing = await db.Event.findByPk(event.id);
  if (!existing) {
    res.status(404).send('Not found');
    return;
  }

  try {
    existing.destroy();

    res.redirect(req.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
    return;
  }
}

module.exports = router;
