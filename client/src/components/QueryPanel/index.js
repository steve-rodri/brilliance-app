import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { hideNav } from "../../redux";
import { singularTense, isDay } from "../../helpers";
import queryString from "query-string";
import moment from "moment";
import Calendar from "../Calendar";
import Search from "../Search/";
import AddNew from "../Buttons/AddNew";
import "./index.css";

const QueryPanel = props => {
  return (
    <div className="QueryPanel">
      <Title {...props} />
      <Search className="QueryPanel--search" />
      <RecentSearches {...props.collection.search} />
      <DatePicker />
      <CreateButton />
    </div>
  );
};

const Title = ({ refresh, collectionType }) => {
  const mobile = useSelector(state => state.view.mobile);
  if (mobile) return null;
  return (
    <h1
      className="QueryPanel--title"
      onClick={e => {
        e.stopPropagation();
        if (refresh) refresh();
      }}
    >
      {collectionType}
    </h1>
  );
};

Title.propTypes = {
  refresh: PropTypes.func
};

const RecentSearches = ({ history: recentSearches }) => {
  const { mobile, section } = useSelector(state => state.view);
  const {
    replace,
    location: { search, pathname }
  } = useHistory();
  const params = queryString.parse(search);

  const activeStyles = category => {
    if (params.q !== category) return {};
    return { color: "var(--turquoise)" };
  };

  if (mobile && section === "Workers") return null;
  if (recentSearches.length === 0) return null;
  return (
    <div className="QueryPanel--recent-searches-container">
      {/* <div className="Arrow Arrow-Left" style={{gridColumn: '1 / span 1'}}></div> */}
      <div className="QueryPanel--recent-searches">
        {recentSearches.length > 0 &&
          recentSearches.map((term, id) => (
            <div
              onClick={e => {
                e.stopPropagation();
                if (params.q !== term) {
                  replace(`${pathname}?q=${term}`);
                }
              }}
              key={id}
            >
              <p style={activeStyles(term)}>{term}</p>
            </div>
          ))}
      </div>
      {/* <div className="Arrow Arrow-Right" style={{gridColumn: '3 / span 1'}}></div> */}
    </div>
  );
};

const DatePicker = () => {
  const date = useSelector(state => state.date);
  const dispatch = useDispatch();
  const { mobile, section } = useSelector(state => state.view);
  const {
    push,
    location: { pathname }
  } = useHistory();

  const handleDateChanged = (date, type) => {
    if (!type) return;
    date = {
      start: moment(date)
        .startOf(type)
        .toISOString(true),
      end: moment(date)
        .endOf(type)
        .toISOString(true)
    };
    if (type === "month") {
      push(`${pathname}?date=${moment(date.start).format("MMM-YYYY")}`);
    }
    if (type === "day") {
      if (mobile) dispatch(hideNav());
      push(`${pathname}?date=${moment(date.start).format("MMM-DD-YYYY")}`);
    }
  };
  const shouldRender = section === "Events" || section === "Invoices";
  if (!shouldRender) return null;
  return (
    <div className="QueryPanel--calendar">
      <Calendar
        date={isDay && date ? new Date(date.start) : new Date()}
        onDateChanged={handleDateChanged}
      />
    </div>
  );
};

const CreateButton = () => {
  const section = useSelector(state => state.view.section);
  const accessLevel = useSelector(state => state.user.accessLevel);
  const type = singularTense(section);
  const linkPath = () => {
    let path = { state: { modal: true } };
    let updatedSection = section.toLowerCase();
    if (section === "workers") updatedSection = "staff";
    path.pathname = `/${accessLevel}/${updatedSection}/new`;
    return path;
  };
  const shouldRender =
    section === "Events" || section === "Clients" || section === "Workers";
  if (!shouldRender) return null;
  return (
    <AddNew className="QueryPanel--button" type={type} linkPath={linkPath()} />
  );
};

export default QueryPanel;
