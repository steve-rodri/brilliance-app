import React from "react";
import { useSelector } from "react-redux";
import BodyComponent from "../BodyComponent";
import Edit from "./Edit";
import "./index.css";

const Logistics = (props) => {
  const { edit: editMode, data } = useSelector(
    (state) => state.section.events.form
  );
  if (!editMode) return null;
  return (
    <BodyComponent
      className="EventDetail-Body--logistics"
      titleText="Logistics"
    >
      <Edit {...props} {...data} />
    </BodyComponent>
  );
};

export default Logistics;
