// CRUD ____________________________________________

const addEvent = async (formData, sendUpdates) => {
  let events = [...this.state.events];
  let newEvent = await event.create(formData, this.ajaxOptions);

  const calendarId = localStorage.getItem("google_calendar_id");
  if (calendarId) {
    const newGoogleEvent = await googleRequests.createEvent(
      calendarId,
      formatToGoogle(newEvent),
      this.ajaxOptions
    );
    let formatted = await formatFromGoogle(newGoogleEvent, this.ajaxOptions);

    if (formatted && formatted.event_employees_attributes) {
      let update = formatted.event_employees_attributes.filter(ee => {
        if (newEvent.staff && newEvent.staff.length) {
          return newEvent.staff.find(
            worker => worker.info.id !== ee.employee_id
          );
        } else {
          return 1;
        }
      });

      if (update && update.length) {
        formatted.event_employees_attributes = update;
      } else {
        delete formatted.event_employees_attributes;
      }
    }
    newEvent = await event.update(newEvent.id, formatted, this.ajaxOptions);
  }
  events.push(newEvent);
  events = events.sort((evtOne, evtTwo) => {
    return moment(evtOne.start).isBefore(moment(evtTwo.start));
  });
  this.setState({ events });
  return newEvent;
};

const deleteEvent = async evt => {
  const calendarId = localStorage.getItem("google_calendar_id");
  let events = [...this.state.events];
  await event.delete(evt.id, this.ajaxOptions);
  if (evt.gcId) {
    await googleRequests.deleteEvent(calendarId, evt.gcId, this.ajaxOptions);
  }
  events = events.filter(e => e.id !== evt.id);
  this.setState({ events });
};
