import React from "react";
import PropTypes from "prop-types";
import ListItem from "../../../components/ListItem";
import Title from "./Title";
import Intel from "./Intel";
import Scheduled from "./Scheduled";
import Confirmation from "./Confirmation";
import { useSelector } from "react-redux";
import "./index.css";

const EventListItem = ({ item: e, scrollToPosition }) => {
  const accessLevel = useSelector(state => state.user.accessLevel);
  if (e.isNextEvent) scrollToPosition();
  return (
    <ListItem
      linkTo={{
        pathname: `/${accessLevel}/events/${e.id}`,
        state: { event: e }
      }}
      style={{
        grid: "auto / 1fr auto",
        gridAutoFlow: "column",
        gridAutoColumns: "auto"
      }}
    >
      <Title event={e} />
      <Intel event={e} />
      <Scheduled event={e} />
      <Confirmation event={e} />
    </ListItem>
  );
};

Event.propTypes = {
  item: PropTypes.object.isRequired
};

export default EventListItem;
