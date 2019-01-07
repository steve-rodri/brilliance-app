import React from 'react'
import GoogleLogin from 'react-google-login'
import logo_t from '../../images/logo_t.GIF'
import './Login.css'

export default function Login(props) {
  return (
    <div className="login-page">
      <div className="login-form">
        <div className="logo-container">
          <img className="logo" src={logo_t} alt='logo'/>
        </div>
        <div className='google-login-container'>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            scope="https://www.googleapis.com/auth/calendar"
            buttonText="Login with Google"
            onSuccess={props.responseGoogle}
            onFailure={props.responseGoogle}
          />
        </div>
      </div>
    </div>
  )
}
