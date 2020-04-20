import React from "react";
import { useDispatch } from "react-redux";
import { Label } from "../BodyComponent";
import { updateEventFormData } from "../../../../../redux";
import {
  styleConfirmationStatus,
  changeConfirmationStatus,
  clientDisplay,
  date,
  time,
  duration,
  locationName
} from "../../../../../helpers";

const View = props => (
  <div className="About">
    <Client {...props} />
    <Location {...props} />
    <Date {...props} />
    <Time {...props} />
    <Duration {...props} />
    <ConfirmationButton {...props} />
  </div>
);

const Client = ({ client }) => {
  if (!client) return null;
  return (
    <>
      <Label text="Client" />
      {clientDisplay(client)}
    </>
  );
};

const Location = ({ location }) => {
  if (!location) return null;
  return (
    <>
      <Label text="Location" />
      <h3>{locationName(location)}</h3>
    </>
  );
};

const Date = ({ start, end }) => {
  if (!start || !end) return null;
  return (
    <>
      <Label text="Date" />
      <h3>{date({ start, end }, false, true)}</h3>
    </>
  );
};

const Time = ({ start, end }) => {
  if (!start || !end) return null;
  return (
    <>
      <Label text="Time" />
      <h3>{time({ start, end })}</h3>
    </>
  );
};

const Duration = ({ start, end }) => {
  if (!start || !end) return null;
  return (
    <>
      <Label text="Duration" />
      <h3>{duration({ start, end })}</h3>
    </>
  );
};

const ConfirmationButton = ({ confirmation }) => {
  const dispatch = useDispatch();
  return (
    <div
      className="About--event-status"
      onClick={e => {
        e.stopPropagation();
        dispatch(
          updateEventFormData({
            confirmation: changeConfirmationStatus(confirmation)
          })
        );
      }}
      style={styleConfirmationStatus(confirmation)}
    >
      <p>{confirmation}</p>
    </div>
  );
};

export default View;
