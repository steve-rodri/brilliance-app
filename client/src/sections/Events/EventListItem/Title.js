import React from "react";
import { ListItemCell } from "../../../components/ListItem";
import { useSelector } from "react-redux";
import { date, time, summaryFormatter } from "../../../helpers";
import "./index.css";

const Title = ({ event: e, styles }) => (
  <ListItemCell>
    <div className="EventListItem--job-description">
      <Summary summary={e.summary} />
      <Time event={e} />
    </div>
  </ListItemCell>
);

const Summary = ({ summary }) => {
  const mobile = useSelector((state) => state.view.mobile);
  const styles = () => {
    if (!mobile && summary.length < 30) return {};
    return { fontSize: "15px" };
  };

  if (!summary) return null;
  return (
    <div className="EventListItem--summary" style={styles()}>
      <h4>{summaryFormatter(summary)}</h4>
    </div>
  );
};

const Time = ({ event: e }) => {
  return (
    <div className="EventListItem--time">
      <p>{date(e, true, true)}</p>
      <p>{time(e)}</p>
    </div>
  );
};

export default Title;
