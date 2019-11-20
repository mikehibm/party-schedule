function init() {
  let _event = {};

  const divForm = $id('divForm');
  const selStartTime = $id('startTime');
  const selEndTime = $id('endTime');
  const txtNote = $id('note');
  const hdnId = $id('id');
  const hdnDate = $id('date');

  const loading = $id('loading');
  // const btnSave = $id('btnSave');
  const btnDelete = $id('btnDelete');
  const btnClose = $id('btnClose');
  const btnNewEvent = $id('btnNewEvent');

  divForm.addEventListener('submit', submitForm);
  // btnSave.addEventListener('click', saveEvent);
  btnDelete.addEventListener('click', deleteEvent);
  btnClose.addEventListener('click', closeForm);
  btnNewEvent.addEventListener('click', openNewEvent);

  const elTimes = document.querySelectorAll(
    '.time.available, .time.booked, .time.admin'
  );
  for (let el of elTimes) {
    el.addEventListener('click', openForm);
  }

  function openNewEvent(e) {
    e.preventDefault();
    openForm(e, true);
  }

  function openForm(e, newEvent) {
    const el = e.target;
    const eventId = el.getAttribute('data-id') | 0;
    const startTime = `${hdnDate.value} ${el.getAttribute('data-start')}:00`;
    const endTime = `${hdnDate.value} ${el.getAttribute('data-end')}:00`;
    const booked = el.classList.contains('booked');
    const isAdmin = el.classList.contains('admin');

    divForm.style.display = 'block';
    _event = {};

    btnNewEvent.setAttribute('data-id', el.getAttribute('data-id'));
    btnNewEvent.setAttribute('data-start', el.getAttribute('data-start'));
    btnNewEvent.setAttribute('data-end', el.getAttribute('data-end'));

    if (booked || (eventId !== 0 && isAdmin && !newEvent)) {
      showLoading();
      fetchEvent(eventId);
    } else {
      _event = {
        id: 0,
        startTime,
        endTime,
        note: '',
        available: eventId === 0,
      };
      showEvent();
      hideLoading();
    }

    if (eventId) {
      const selectedElements = document.querySelectorAll(
        `.events-datail .times .time.selected`
      );
      for (const el of selectedElements) {
        el.classList.remove('selected');
      }

      if (booked) {
        const elements = document.querySelectorAll(
          `.events-datail .times .time[data-id='${eventId}']`
        );
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
        // alert(err.message);
        // eslint-disable-next-line no-undef
        Notiflix.Report.Failure('Error', err.message);
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
    btnNewEvent.style.display =
      _event.id && _event.available ? 'inline' : 'none';
  }

  function showLoading() {
    loading.style.display = 'grid';
  }

  function hideLoading() {
    loading.style.display = 'none';
  }

  function closeForm() {
    divForm.style.display = 'none';
  }

  function submitForm(e) {
    // Disable submitting by browser.
    e.preventDefault();

    saveEvent();
  }

  function validate() {
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
      // alert(msg);
      // eslint-disable-next-line no-undef
      Notiflix.Report.Failure('Error', msg);
      return false;
    }
    return true;
  }

  function saveEvent() {
    if (!validate()) return;

    showLoading();

    const url = `/events/${_event.id}`;
    const body = JSON.stringify(_event);
    console.log('body = ', body);

    return fetch(url, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body,
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          _event = data;
          console.log('event = ', _event);
        } else {
          throw new Error(data.message || data);
        }
        // window.location.href = window.location.href + '';
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        hideLoading();
        // alert(err.message);
        // eslint-disable-next-line no-undef
        Notiflix.Report.Failure('Error', err.message);
      });
  }

  function deleteEvent(e) {
    e.preventDefault();

    // eslint-disable-next-line no-undef
    Notiflix.Confirm.Show(
      'Confirm Delete',
      'Are you sure to delete the event?',
      'DELETE',
      'Cancel',

      // ok button callback
      function() {
        showLoading();

        const url = `/events/${_event.id}`;
        return fetch(url, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(data => {
            if (data.result !== 'ok') {
              throw new Error(data.message || data);
            }
            // window.location.href = window.location.href + '';
            window.location.reload();
          })
          .catch(err => {
            console.error(err);
            hideLoading();
            // alert(err.message);
            // eslint-disable-next-line no-undef
            Notiflix.Report.Failure('Error', err.message);
          });
      },

      // cancel button callback
      function() {
        console.log('Delete canceled.');
      }
    );
  }
}

window.addEventListener('DOMContentLoaded', init);

// eslint-disable-next-line no-undef
Notiflix.Notify.Init();
// eslint-disable-next-line no-undef
Notiflix.Report.Init();
// eslint-disable-next-line no-undef
Notiflix.Confirm.Init();
