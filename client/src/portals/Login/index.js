import React from "react";
import GoogleLogin from "react-google-login";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actions from "../../redux";
import logo_t from "../../images/logo_t.GIF";
import "./styles.css";

const Login = props => {
  const { isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();

  let { from } = props.location.state || { from: { pathname: "/" } };
  if (isAuthenticated) return <Redirect to={from} />;

  return (
    <div className="login-page">
      <div className="login-form">
        <div className="logo-container">
          <img className="logo" src={logo_t} alt="logo" />
        </div>
        <div className="google-login-container">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            scope="https://www.googleapis.com/auth/calendar"
            buttonText="Login with Google"
            onSuccess={resp => dispatch(actions.authenticate(resp))}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
