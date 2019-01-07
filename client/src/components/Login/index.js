import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import { Redirect } from 'react-router-dom'
import logo_t from '../../images/logo_t.GIF'
import './Login.css'

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToDashboard: false
    }
  }

  componentDidMount(){
    if (this.loggedIn()) {
      this.setState({
        redirectToDashboard: true
      })
    }
  }

  loggedIn = () => {
    const token = localStorage.getItem('google_access_token')
    if (token) {
      return true
    } else {
      return false
    }
  }

  responseGoogle = (resp) => {
    this.setState({
      redirectToDashboard:true
    })
    if (resp.accessToken) {
      localStorage.setItem('google_access_token',resp.accessToken)
      localStorage.setItem('profileObj', JSON.stringify(resp.profileObj))
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
              onFailure={this.responseGoogle}
            />
          </div>
        </div>
      </div>
    )
  }
}
