import React, { useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Admin from "./portals/Admin";
import Login from "./portals/Login";
import { useSelector, useDispatch } from "react-redux";
import { resize } from "./redux";

const Router = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resize());
    window.addEventListener("resize", dispatch(resize()));
    return () => {
      window.removeEventListener("resize", dispatch(resize()));
    };
  });

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
