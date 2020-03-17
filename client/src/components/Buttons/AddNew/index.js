import React from "react";
import { Link } from "react-router-dom";
import { plusIcon } from "../../../icons";
import "./index.css";

export default function AddNew(props) {
  const { linkPath, type, className, style } = props;
  return (
    <Link
      to={linkPath}
      className={className}
      style={{ textDecoration: "none", color: "black", ...style }}
    >
      <button className="AddNew">
        <p className="AddNew--button-text">{`New ${type}`}</p>
        {plusIcon("2x", "AddNew--button-icon")}
      </button>
    </Link>
  );
}
