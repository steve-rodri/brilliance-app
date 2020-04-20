import React from "react";
import { ListItemCell } from "../../../components/ListItem";
import { useDispatch } from "react-redux";
import { changeEventConfirmationStatus } from "../../../redux";
import { styleConfirmationStatus } from "../../../helpers";
import moment from "moment";
import "./index.css";

const Confirmation = ({ event: e }) => {
  const dispatch = useDispatch();
  const eventIsAfterToday = moment(e.start).isSameOrAfter(moment(), "days");
  const onStatusChange = click => {
    click.preventDefault();
    click.stopPropagation();
    dispatch(changeEventConfirmationStatus(e));
  };

  const render = () => {
    if (!eventIsAfterToday)
      return <div className="EventListItem--confirmation"></div>;
    return (
      <div
        className="EventListItem--confirmation"
        style={styleConfirmationStatus(e.confirmation)}
        onClick={onStatusChange}
      >
        <p>{e.confirmation.toUpperCase()}</p>
      </div>
    );
  };
  return <ListItemCell>{render()}</ListItemCell>;
};

export default Confirmation;
