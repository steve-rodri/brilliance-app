import React, { useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import QueryPanel from "../QueryPanel";
import Bars from "../Buttons/Bars/index.js";
import logo from "../../images/logo_t.GIF";
import { useSelector, useDispatch } from "react-redux";
import { toggleNav } from "../../redux";
import { userCircleIcon } from "../../icons";
import "./index.css";

const Header = props => {
  const [toDashboard, setToDashboard] = useState(false);
  const { accessLevel } = useSelector(state => state.user);
  const { nav } = useSelector(state => state.view);
  const location = useLocation();

  const onRedirectDashboard = () => {
    if (!location) return;
    if (location.pathname !== `/${accessLevel}`) {
      setToDashboard(true);
    }
  };
  if (toDashboard) return <Redirect to="/" />;

  return (
    <>
      <div className="Header--fixed-space"></div>
      <header>
        <Logo onRedirectDashboard={onRedirectDashboard} />
        <Navigation />
        {/* Hamburger Drop Down */}
        {nav ? <Dropdown /> : null}
      </header>
    </>
  );
};

const Dropdown = () => {
  const currentSection = useSelector(state => state.view.section);
  const { accessLevel } = useSelector(state => state.user);
  const collection = useSelector(
    state => state.section[currentSection.toLowerCase()]
  );
  const styleNavMenu = () => {
    if (currentSection === "Dashboard") {
      return { gridAutoFlow: "row", gridRow: "span 2", fontSize: "2em" };
    } else return {};
  };
  return (
    <div className="Header--drop-down">
      <div className="Header--nav-menu" style={styleNavMenu()}>
        <JobsLink accessLevel={accessLevel} />
        <StaffLink accessLevel={accessLevel} />
        <InventoryLink accessLevel={accessLevel} />
      </div>
      {currentSection !== "Dashboard" ? (
        <QueryPanel collectionType={currentSection} collection={collection} />
      ) : null}
    </div>
  );
};

const Logo = ({ onRedirectDashboard }) => (
  <img onClick={onRedirectDashboard} className="logo" src={logo} alt="logo" />
);

const Navigation = () => {
  const { mobile, nav } = useSelector(state => state.view);
  const { profile, accessLevel } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const onBarsPress = () => dispatch(toggleNav());
  if (mobile) return <Bars changeNav={onBarsPress} open={nav} />;
  else
    return (
      <>
        <nav>
          <JobsLink accessLevel={accessLevel} />
          <StaffLink accessLevel={accessLevel} />
          <InventoryLink accessLevel={accessLevel} />
        </nav>
        <UserCircle profile={profile} />
      </>
    );
};

const UserCircle = ({ onLogOut, profile }) => {
  const image = () => {
    if (!profile.imageUrl)
      return userCircleIcon("3x", { color: "var(--light-blue)" });
    else return <img className="user-photo" src={profile.imageUrl} alt="You" />;
  };
  return (
    <div className="user-circle" onClick={onLogOut}>
      {image()}
    </div>
  );
};

const JobsLink = ({ accessLevel }) => (
  <Link to={{ pathname: `/${accessLevel}/events`, state: { nav: false } }}>
    <h2>Jobs</h2>
  </Link>
);

const StaffLink = ({ accessLevel }) => (
  <Link to={{ pathname: `/${accessLevel}/staff`, state: { nav: false } }}>
    <h2>Staff</h2>
  </Link>
);

const InventoryLink = ({ accessLevel }) => (
  <Link to={{ pathname: `/${accessLevel}/inventory`, state: { nav: false } }}>
    <h2>Inventory</h2>
  </Link>
);

// const ClientsLink = ({ accessLevel }) => (
//   <Link to={{ pathname: `/${accessLevel}/clients`, state: { nav: false } }}>
//     <h2>Clients</h2>
//   </Link>
// );
//
// const InvoicesLink = ({ accessLevel }) => (
//   <Link to={{ pathname: `/${accessLevel}/invoices`, state: { nav: false } }}>
//     <h2>Invoices</h2>
//   </Link>
// );

export default Header;
