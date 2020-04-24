import React from "react";
import { useSelector } from "react-redux";
import BodyComponent from "../BodyComponent";
import Edit from "./Edit";
import View from "./View";
import "./index.css";

const Staff = (props) => {
  const { edit: editMode, data } = useSelector(
    (state) => state.section.events.form
  );

  const render = () => {
    if (editMode) return <Edit {...props} {...data} />;
    else return <View {...props} {...data} />;
  };

  return (
    <BodyComponent className="EventDetail-Body--staff" titleText="Staff">
      {render()}
    </BodyComponent>
  );
};

export default Staff;
