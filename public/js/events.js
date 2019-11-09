function init() {
  let _event = {};

  const form = $id('form');
  const selStartTime = $id('startTime');
  const selEndTime = $id('endTime');
  const txtNote = $id('note');
  const hdnId = $id('id');
  const hdnDate = $id('date');

  const loading = $id('loading');
  const btnSave = $id('btnSave');
  const btnDelete = $id('btnDelete');
  const btnClose = $id('btnClose');

  form.addEventListener('submit', showLoading);
  btnSave.addEventListener('click', saveEvent);
  btnDelete.addEventListener('click', deleteEvent);
  btnClose.addEventListener('click', closeForm);

  const elTimes = document.querySelectorAll(
    '.events-datail .times .time.available, .events-datail .times .time.booked'
  );
  for (let el of elTimes) {
    el.addEventListener('click', openForm);
  }

  function openForm(e) {
    const eventId = e.target.getAttribute('data-id') | 0;
    const startTime = hdnDate.value + ' ' + e.target.getAttribute('data-start') + ':00';
    const endTime = hdnDate.value + ' ' + e.target.getAttribute('data-end') + ':00';
    const booked = e.target.getAttribute('data-booked') === 'true';

    form.style.display = 'block';
    _event = {};

    if (booked) {
      showLoading();
      fetchEvent(eventId);
    } else {
      _event = {
        id: 0,
        startTime,
        endTime,
        note: '',
      };
      showEvent();
      hideLoading();
    }

    if (eventId) {
      const selectedElements = document.querySelectorAll(`.events-datail .times .time.selected`);
      for (const el of selectedElements) {
        el.classList.remove('selected');
      }

      if (booked) {
        const elements = document.querySelectorAll(`.events-datail .times .time[data-id='${eventId}']`);
        for (const el of elements) {
          el.classList.add('selected');
        }
      }
    }
  }

  function fetchEvent(id) {
    const url = `/events?id=${id}`;

    return fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        _event = data.length ? data[0] : null;
        console.log('event = ', _event);
        hideLoading();
        showEvent();
      })
      .catch(err => {
        console.error(err);
        hideLoading();
        alert(err.message);
      });
  }

  function getTimeStr(d) {
    return d.split(' ')[1].substr(0, 5);
  }

  function showEvent() {
    hdnId.value = _event.id;
    selStartTime.value = getTimeStr(_event.startTime);
    selEndTime.value = getTimeStr(_event.endTime);
    txtNote.value = _event.note;

    btnDelete.style.display = _event.id ? 'inline' : 'none';
  }

  function showLoading() {
    loading.style.display = 'grid';
  }

  function hideLoading() {
    loading.style.display = 'none';
  }

  function closeForm() {
    form.style.display = 'none';
  }

  function saveEvent(e) {
    const date = hdnDate.value;
    _event.startTime = `${date} ${selStartTime.value}`;
    _event.endTime = `${date} ${selEndTime.value}`;
    _event.note = txtNote.value;

    const errors = [];

    if (_event.startTime >= _event.endTime) {
      errors.push('Start time must be ealier than End time.');
    }

    if (errors.length) {
      const msg = errors.join(', ');
      alert(msg);

      e.preventDefault();
      return;
    }
  }

  function deleteEvent(e) {
    if (!confirm('Are you sure to delete the event?')) {
      e.preventDefault();
      return;
    }
  }
}

window.addEventListener('DOMContentLoaded', init);
