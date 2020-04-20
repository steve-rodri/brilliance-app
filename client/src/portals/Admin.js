import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Dashboard from "../sections/Dashboard";
import Clients from "../sections/Clients";
import Events from "../sections/Events";
import Invoices from "../sections/Invoices";
import Staff from "../sections/Staff";

const Admin = ({ match: { path } }) => {
  const rootMatch = useRouteMatch(path);
  const eventsMatch = useRouteMatch(`${path}/events`);
  const clientsMatch = useRouteMatch(`${path}/clients`);
  const invoicesMatch = useRouteMatch(`${path}/invoices`);
  const staffMatch = useRouteMatch(`${path}/staff`);
  const render = () => {
    if (rootMatch.isExact) return <Dashboard match={rootMatch} />;
    if (eventsMatch) return <Events match={eventsMatch} />;
    if (clientsMatch) return <Clients match={clientsMatch} />;
    if (invoicesMatch) return <Invoices match={invoicesMatch} />;
    if (staffMatch) return <Staff match={staffMatch} />;
  };
  return (
    <>
      <Header />
      {render()}
      <MobileSpace />
    </>
  );
};

const MobileSpace = () => {
  const mobile = useSelector(state => state.view.mobile);
  if (!mobile) return null;
  return <div className="Mobile-Space" style={{ height: "115px" }}></div>;
};

export default Admin;
