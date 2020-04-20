import React from "react";
import { useSelector } from "react-redux";
import "./index.css";

const BodyComponent = ({ children, className, titleText }) => {
  return (
    <div className={`BodyComponent ${className}`}>
      <Title text={titleText} />
      <Container labelText={titleText}>{children}</Container>
    </div>
  );
};

const Title = ({ text }) => {
  const mobile = useSelector(state => state.view.mobile);
  if (mobile) return null;
  return (
    <div className="BodyComponent--title">
      <h4>{text}</h4>
    </div>
  );
};

const Container = ({ children, labelText }) => {
  const mobile = useSelector(state => state.view.mobile);
  const editMode = useSelector(state => state.section.events.form.edit);
  const styleContainer = () => {
    let style = {};
    if (!mobile && editMode) style.padding = "15px 20px";
    return style;
  };
  return (
    <div className={`${labelText}--container`} style={styleContainer()}>
      <Label text={labelText} />
      {children}
    </div>
  );
};

export const Label = ({ text }) => {
  const { mobile } = useSelector(state => state.view);
  if (!mobile) return null;
  return <label>{text}</label>;
};

export default BodyComponent;
