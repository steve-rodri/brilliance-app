import React, { useEffect } from "react";
import { Redirect, useRouteMatch, useLocation } from "react-router-dom";
import Admin from "./portals/Admin";
import Login from "./portals/Login";
import { useSelector, useDispatch } from "react-redux";
import { setMobile, hideNav } from "./redux";
import "./App.css";

const App = props => {
  const dispatch = useDispatch();
  const { mobile, nav } = useSelector(state => state.view);
  const rootMatch = useRouteMatch("/");
  const loginMatch = useRouteMatch("/login");
  const adminMatch = useRouteMatch("/admin");
  useEffect(() => {
    const width = window.innerWidth;
    const setIntitialViewState = () => {
      if (width < 750)
        if (!mobile) dispatch(setMobile(true));
        else if (mobile) dispatch(setMobile(false));
      if (width > 1000) if (nav) dispatch(hideNav());
    };
    setIntitialViewState();
  }, [dispatch, mobile, nav]);

  useEffect(() => {
    const resize = () => {
      resetView();
      updateNav();
    };
    const resetView = () => {
      const width = window.innerWidth;
      if ((width < 750) & !mobile) dispatch(setMobile(true));
      else if ((width > 750) & mobile) dispatch(setMobile(false));
    };
    const updateNav = () => {
      const width = window.innerWidth;
      if ((width > 1000) & nav) dispatch(hideNav());
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [dispatch, mobile, nav]);

  if (rootMatch.isExact) return <Root />;
  if (loginMatch) return <Login match={loginMatch} />;
  if (adminMatch) return <PrivateRoute component={Admin} match={adminMatch} />;
};

const Root = () => {
  const { isAuthenticated, accessLevel } = useSelector(state => state.user);
  if (isAuthenticated) return <Redirect to={`/${accessLevel}`} />;
  else return <Redirect to="/login" />;
};

const PrivateRoute = ({ component: Component, ...props }) => {
  const { isAuthenticated } = useSelector(state => state.user);
  const location = useLocation();
  if (isAuthenticated) return <Component {...props} />;
  else
    return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
};

export default App;
