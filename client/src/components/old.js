const setCategories = categories => {
  this.setState({ categories });
};

const singularView = view => {
  if (view)
    return view
      .split("")
      .splice(0, view.length - 1)
      .join("");
  return "";
};

const camelToSnakeCase = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const isDay = () => {
  const { date } = this.state;
  const isDay = moment(date.end).diff(moment(date.start), "days") <= 1;
  return isDay;
};

const isMonth = () => {
  const {
    date: { start: s, end: e }
  } = this.state;
  const start = moment(s);
  const end = moment(e);
  const isMonth =
    start.month() === end.month() &&
    start.date() === 1 &&
    end.date() === start.daysInMonth();
  return isMonth;
};

const handleDateChange = (date, type) => {
  if (type) {
    this.setState(prevState => ({
      date: {
        start: moment(date)
          .startOf(type)
          .toISOString(true),
        end: moment(date)
          .endOf(type)
          .toISOString(true)
      }
    }));
    if (type === "day") this.changeNav(false);
  }
};

// -------------------------------Google--------------------------------------

const synchronizeAllEvents = async () => {
  const calendarId = localStorage.getItem("google_calendar_id");
  const events = await GOOGLE.getEvents(calendarId, this.ajaxOptions);
  if (events) {
    const evts = await Promise.all(
      events.map(async evt => await formatFromGoogle(evt, this.ajaxOptions))
    );
    await Promise.all(
      evts.map(async evt => await event.sync(evt, this.ajaxOptions))
    );
  }
};

const changeNav = value => {
  const { history, location } = this.props;
  this.setState({ displayNav: value });
  history.push({ pathname: `${location.pathname}`, state: { nav: value } });
};
