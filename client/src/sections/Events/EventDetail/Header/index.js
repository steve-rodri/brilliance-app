import React, { Fragment } from "react";
import { pencilIcon, checkIcon, timesIcon } from "../../../../icons";
import "./index.css";

export default function Header(props) {
  const {
    evt,
    fields,
    isNew,
    editMode,
    mobile,
    handleChange,
    history,

    back,
    close,
    edit,
    handleSubmit
  } = props;

  // Functions to Show Summary field based on Mode ----------------------

  const handleFocusSelect = e => {
    e.target.select();
  };

  function displaySummary() {
    if (editMode && evt && !mobile) {
      return (
        <div className="EventDetail--event-title-container">
          <input
            className="EventDetail--event-summary"
            name="summary"
            value={fields.summary ? fields.summary : ""}
            onChange={handleChange}
            onFocus={handleFocusSelect}
          />
        </div>
      );
    } else {
      return (
        <div className="EventDetail--event-title-container">
          <h2 className="EventDetail--event-title">
            {fields && fields.summary}
          </h2>
        </div>
      );
    }
  }

  // Functions to Dynamically change buttons based on Mode ---------------
  function cancel() {
    if (!isNew && evt) {
      return (
        <div className="EventDetail--icon left" onClick={close}>
          {timesIcon("2x")}
        </div>
      );
    }
  }

  function Edit() {
    return (
      <div className="EventDetail--icon right" onClick={edit}>
        {pencilIcon("2x")}
      </div>
    );
  }

  function submit() {
    return (
      <div className="EventDetail--icon right" onClick={e => handleSubmit()}>
        {checkIcon("2x")}
      </div>
    );
  }

  function displayButtons() {
    if (editMode) {
      return (
        <div className="EventDetail--icons">
          {cancel()}
          {submit()}
        </div>
      );
    } else {
      return (
        <div className="EventDetail--icons">
          {Edit()}
          {/* {trashCan()} */}
        </div>
      );
    }
  }

  //----------------------------------------------------------------------

  function display() {
    if (isNew) {
      return (
        <Fragment>
          {mobile ? (
            <button
              className="EventDetail--back-button"
              onClick={() => history.goBack()}
            >
              Back
            </button>
          ) : null}
          <div className="EventDetail--event-title-container">
            <h2 className="EventDetail--event-title">New Event</h2>
          </div>
          {!mobile ? (
            <div className="EventDetail--header-right">{displayButtons()}</div>
          ) : null}
        </Fragment>
      );
    } else if (mobile && editMode) {
      return (
        <Fragment>
          <button className="EventDetail--back-button" onClick={back}>
            Back
          </button>
          <div className="EventDetail--event-title-container">
            <h2 className="EventDetail--event-title">Edit Event</h2>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          {displaySummary()}
          <div className="EventDetail--header-right">{displayButtons()}</div>
        </Fragment>
      );
    }
  }

  return <div className="EventDetail--header">{display()}</div>;
}
