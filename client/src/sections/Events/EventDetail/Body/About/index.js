import React from "react";
import { useSelector } from "react-redux";
import View from "./View";
import Form from "./Form";
import BodyComponent from "../BodyComponent";
import "./index.css";

const About = (props) => {
  const { edit: editable, data } = useSelector(
    (state) => state.section.events.form
  );
  return (
    <BodyComponent className="EventDetail-Body--about" titleText="About">
      {editable ? <Form {...props} {...data} /> : <View {...props} {...data} />}
    </BodyComponent>
  );
};

export default About;
