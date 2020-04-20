import React, { useEffect } from "react";
// import Search from '../../../Search/index.js'
import Schedule from "./Schedule/index.js";
import { useSelector, useDispatch } from "react-redux";
import { setSection, syncAllEvents } from "../../redux";
import { greeting } from "../../helpers";
import "./index.css";

const Dashboard = props => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSection("Dashboard"));
  }, [dispatch]);
  return (
    <div className="Dashboard">
      <h1 className="Dashboard--intro">{greeting(user)}</h1>
      <Schedule {...props} />
      <button onClick={() => dispatch(syncAllEvents())}>Sync</button>
    </div>
  );
};

export default Dashboard;
