import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import { Redirect } from 'react-router-dom'
import logo_t from '../../images/logo_t.GIF'
import axios from 'axios'
import './Login.css'

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToApp: false
    }
    this.axiosRequestSource = axios.CancelToken.source()
  }

  async componentDidMount(){
    const user = await this.props.getUser()
    if (user) this.setState({ redirectToApp: true })
  }

  async componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  responseGoogle = (resp) => {
    const { history } = this.props
    if (resp.accessToken) {
      localStorage.setItem('google_access_token',resp.accessToken)
      history.push('/')
    }
  }

  render(){
    if (this.state.redirectToApp) return <Redirect to="/" />
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
