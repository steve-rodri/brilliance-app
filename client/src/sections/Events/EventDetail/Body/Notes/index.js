import React, { useEffect } from "react";
import { useTraceableState } from "../../../../../hooks";
import BodyComponent from "../BodyComponent";
import { useSelector, useDispatch } from "react-redux";
import { updateEventFormData, deleteEventFormData } from "../../../../../redux";

import "./index.css";

const Notes = ({ notes }) => {
  const [value, setValue, prevValue] = useTraceableState(notes);
  const { edit: editMode } = useSelector((state) => state.section.events.form);
  const dispatch = useDispatch();
  const handleChange = ({ target: { value } }) => setValue(value);
  useEffect(() => {
    if (value) dispatch(updateEventFormData({ notes: value }));
  }, [dispatch, value]);
  useEffect(() => {
    if (prevValue && !value) dispatch(deleteEventFormData({ notes }));
  }, [dispatch, notes, prevValue, value]);

  const format = (text) => {
    if (!text) return;
    const arr = text.split(`\n`);
    return arr.map((p, id) => <p key={id}>{p}</p>);
  };

  const render = () => {
    if (editMode) {
      return (
        <textarea
          className="Notes"
          type="text"
          name="notes"
          value={value}
          onChange={handleChange}
          tabIndex="9"
        />
      );
    } else {
      return <div className="Notes--readonly">{format(notes)}</div>;
    }
  };

  return (
    <BodyComponent className="EventDetail-Body--notes" titleText="Notes">
      {render()}
    </BodyComponent>
  );
};

export default Notes;
