import React from 'react'
import GoogleLogin from 'react-google-login'
import './Login.css'

export default function Login (props) {
  return (
    <div>
      <div>
        <img />
      </div>
      <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          scope="https://www.googleapis.com/auth/calendar"
          buttonText="Login with Google"
          onSuccess={props.responseGoogle}
          onFailure={props.responseGoogle}
        />
      </div>
    </div>
  )
}
