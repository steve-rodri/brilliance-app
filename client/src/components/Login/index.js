import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import { Redirect } from 'react-router-dom'
import logo_t from '../../images/logo_t.GIF'
import axios from 'axios'
import './index.css'



export default class Login extends Component {
  state = { redirectToApp: false }
  axiosRequestSource = axios.CancelToken.source()

  componentDidUpdate(prevProps){
    this.checkLogin(prevProps)
  }

  checkLogin = (prevProps) => {
    const { user } = this.props
    if (user.isAuthenticated) {
      this.setState({ redirectToApp : true });
    }
  }

  async componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  responseGoogle = (resp) => {
    const { authenticate } = this.props
    if (resp.accessToken) {
      localStorage.setItem('google_access_token',resp.accessToken)
      authenticate(async() => {
        await this.setState({ redirectToApp : true });
      });
    }
  }

  render(){
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToApp } = this.state;
    if ( redirectToApp ) return <Redirect to={from}/>;

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
