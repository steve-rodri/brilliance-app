import React from "react";
import StaffSelector from "./StaffSelector";
import { useSelector } from "react-redux";

const Edit = (props) => {
  const mobile = useSelector((state) => state.view.mobile);
  if (mobile)
    return (
      <>
        <label>Staff</label>
        <div className="Staff--choose-workers" onClick={props.openStaff}>
          <p style={{ fontWeight: 700 }}>Choose Workers</p>
        </div>
      </>
    );
  else return <StaffSelector {...props} />;
};

export default Edit;
