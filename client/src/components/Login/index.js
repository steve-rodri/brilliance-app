import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import { Redirect } from 'react-router-dom'
import { GOOGLE } from '../../services/google_service'
import logo_t from '../../images/logo_t.GIF'
import './Login.css'

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToDashboard: false
    }
  }

  async componentDidMount(){
    const user = await GOOGLE.getUser()
    if (user) {
      this.setState({ redirectToDashboard: true })
    }
  }

  responseGoogle = (resp) => {
    if (resp.accessToken) {
      localStorage.setItem('google_access_token',resp.accessToken)
      localStorage.setItem('profileObj', JSON.stringify(resp.profileObj))
      this.setState({ redirectToDashboard: true })
    }
  }

  render(){
    if (this.state.redirectToDashboard) return (<Redirect to="/admin" />)
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
              onSuccess={this.responseGoogle}
            />
          </div>
        </div>
      </div>
    )
  }
}
