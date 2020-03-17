import React, { useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Admin from "./portals/Admin";
import Login from "./portals/Login";
import { useSelector, useDispatch } from "react-redux";
import { setMobile, setNav } from "./redux";

const Router = () => {
  const dispatch = useDispatch();
  const view = useSelector(state => state.view);

  useEffect(() => {
    const width = window.innerWidth;
    const setIntitialViewState = () => {
      if (width < 750) dispatch(setMobile(true));
      else dispatch(setMobile(false));
      if (width > 1000) dispatch(setNav(false));
    };
    setIntitialViewState();
  }, [dispatch]);

  useEffect(() => {
    const resize = () => {
      resetView();
      updateNav();
    };

    const resetView = () => {
      const width = window.innerWidth;
      if ((width < 750) & !view.mobile) dispatch(setMobile(true));
      else if ((width > 750) & view.mobile) dispatch(setMobile(false));
    };

    const updateNav = () => {
      const width = window.innerWidth;
      if ((width > 1000) & view.nav) dispatch(setNav(false));
    };

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [dispatch, view.mobile, view.nav]);

  return (
    <Switch>
      <Route exact path="/" component={Root} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/admin" component={Admin} />
    </Switch>
  );
};

const Root = () => {
  const { isAuthenticated, accessLevel } = useSelector(state => state.user);
  if (isAuthenticated) return <Redirect to={`/${accessLevel}`} />;
  else return <Redirect to="/login" />;
};

const PrivateRoute = ({ path, component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(state => state.user);
  const render = props => {
    if (isAuthenticated) return <Component {...rest} {...props} />;
    else
      return (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      );
  };

  return <Route path={path} render={render} />;
};

export default Router;
