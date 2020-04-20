import React from "react";
import { useSelector } from "react-redux";
import BodyComponent from "../BodyComponent";
import Edit from "./Edit";
import View from "./View";
import "./index.css";

const Staff = props => {
  const { edit: editMode } = useSelector(state => state.section.events.form);

  const render = () => {
    if (editMode) return <Edit {...props} />;
    else return <View {...props} />;
  };

  if (props.staff && !props.staff.length) return null;
  return (
    <BodyComponent className="EventDetail-Body--staff" titleText="Staff">
      {render()}
    </BodyComponent>
  );
};

export default Staff;
