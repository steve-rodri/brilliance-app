import React, { useState, useRef } from "react";
import Datetime from "react-datetime";
import { trashIcon } from "../../icons";
import moment from "moment";
import "./react-datetime.css";
import "./index.css";

const DateSelector = ({ name, value, onDateChange, ...rest }) => {
  const [isOpen, setOpen] = useState(false);
  const [isSelecting, setSelecting] = useState(false);
  const buttonRef = useRef();
  const close = () => (!isSelecting ? setOpen(false) : null);
  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!isOpen);
  };
  const selecting = (e) => {
    setSelecting(true);
    buttonRef.current.focus();
  };
  const notSelecting = (e) => {
    setSelecting(false);
    buttonRef.current.focus();
  };
  const displayValue =
    value && moment(value).isValid() ? moment(value).format("llll") : "";
  return (
    <div className="DateSelector Edit--field">
      <Value
        {...rest}
        toggle={toggle}
        close={close}
        buttonRef={buttonRef}
        displayValue={displayValue}
      />
      <DatePicker
        {...rest}
        isOpen={isOpen}
        selecting={selecting}
        notSelecting={notSelecting}
        close={close}
        value={value}
        onDateChange={onDateChange}
      />
    </div>
  );
};

const Value = ({ toggle, close, buttonRef, displayValue }) => {
  return (
    <button
      className="datetime"
      onClick={toggle}
      onBlur={close}
      ref={buttonRef}
    >
      <h3>{displayValue}</h3>
    </button>
  );
};

const DatePicker = (props) => {
  const {
    selecting,
    notSelecting,
    close,
    value,
    onDateChange,
    isOpen,
    ...rest
  } = props;
  if (!isOpen) return null;
  return (
    <div
      className="DateSelector--container"
      onMouseEnter={selecting}
      onMouseLeave={notSelecting}
      onBlur={close}
    >
      <Datetime
        {...rest}
        input={false}
        value={value ? moment(value) : moment().startOf("hour")}
        timeConstraints={{ minutes: { step: 5 } }}
        onChange={(datetime) => onDateChange(datetime)}
        closeOnSelect={false}
      />
    </div>
  );
};

export default DateSelector;
