import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { pencilIcon, checkIcon, timesIcon } from "../../../../icons";
import { updateEventFormData, toggleEventFormEdit } from "../../../../redux";
import "./index.css";

const Header = props => {
  const { mobile } = useSelector(state => state.view);
  const { data, edit: editMode } = useSelector(
    state => state.section.events.form
  );
  const { goBack } = useHistory();
  return (
    <div className="EventDetail--header">
      <BackButton show={mobile} onBack={() => goBack()} />
      <Summary {...props} data={data} editMode={editMode} />
      <Buttons {...props} data={data} editMode={editMode} />
    </div>
  );
};

const BackButton = ({ show, onBack }) => {
  if (!show) return null;
  return (
    <button className="EventDetail--back-button" onClick={onBack}>
      Back
    </button>
  );
};

const Summary = ({ data, editMode, ...rest }) => {
  const handleFocusSelect = e => e.target.select();
  const mobile = useSelector(state => state.view.mobile);
  const dispatch = useDispatch();
  const render = () => {
    if (editMode && !mobile) {
      return (
        <input
          className="EventDetail--event-summary"
          name="summary"
          value={data.summary ? data.summary : ""}
          onChange={({ target: { value } }) =>
            dispatch(updateEventFormData({ summary: value }))
          }
          onFocus={handleFocusSelect}
        />
      );
    } else {
      return <h2 className="EventDetail--event-title">{data.summary}</h2>;
    }
  };
  return <div className="EventDetail--event-title-container">{render()}</div>;
};

const Buttons = ({ editMode, close, ...rest }) => {
  const dispatch = useDispatch();
  const toggleEdit = () => dispatch(toggleEventFormEdit());
  return (
    <div className="EventDetail--header-right">
      <div className="EventDetail--icons">
        {editMode ? (
          <>
            <CancelButton onCancel={toggleEdit} />
            <SubmitButton {...rest} />
          </>
        ) : (
          <EditButton onEdit={toggleEdit} />
        )}
      </div>
    </div>
  );
};

const CancelButton = ({ onCancel }) => {
  return (
    <div className="EventDetail--icon left" onClick={onCancel}>
      {timesIcon("2x")}
    </div>
  );
};

const EditButton = ({ onEdit }) => {
  return (
    <div className="EventDetail--icon right" onClick={onEdit}>
      {pencilIcon("2x")}
    </div>
  );
};

const SubmitButton = ({ onSubmit }) => {
  return (
    <div className="EventDetail--icon right" onClick={onSubmit}>
      {checkIcon("2x")}
    </div>
  );
};

export default Header;
