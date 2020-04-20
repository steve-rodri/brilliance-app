import React, { useEffect } from "react";
import List from "../../../components/List/";
import { useSelector, useDispatch } from "react-redux";
import { fetchUpcomingUserEvents } from "../../../redux";
import "./Schedule.css";

const Schedule = props => {
  const scheduledEventsList = useSelector(
    state => state.section.dashboard.schedule.list
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUpcomingUserEvents());
  }, [dispatch]);
  return (
    <div className="Schedule--container">
      <Dialog data={scheduledEventsList.data} />
      <List
        {...props}
        {...scheduledEventsList}
        collectionType="Scheduled Events"
        loadMore={() => dispatch(fetchUpcomingUserEvents())}
        changeConfirmationStatus
      />
    </div>
  );
};

const Dialog = ({ data }) => {
  const dialog = () => {
    if (!data.length) {
      return (
        <p className="Schedule--not-currently">
          {" "}
          You are not scheduled on any upcoming events at this time...
        </p>
      );
    } else if (data.length > 1) {
      return <p>{`You are scheduled on ${data.length} upcoming events.`}</p>;
    } else {
      return <p>{`You are scheduled on 1 upcoming event.`}</p>;
    }
  };
  return <div className="Schedule--dialog">{dialog()}</div>;
};

export default Schedule;
