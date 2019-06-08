import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import NavSection from '../NavSection'
import Bars from '../Buttons/Bars/index.js'
import logo_t from '../../images/logo_t.GIF'
import { userCircleIcon } from '../../helpers/icons'
import './index.css'

export default class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToLogin: false,
      redirectToDashboard: false,
    }
  }

  componentDidUpdate(prevProps){
    const { location } = this.props
    const { location: stateLocation } = this.state
    if (location !== stateLocation) this.setState({ location })
  }

  logOut = async() => {
    const { signout } = this.props
    signout()
  }

  toDashboard = () => {
    const { location } = this.state
    const { user: { accessLevel } } = this.props
    if (location) {
      if (location.pathname !== `/${accessLevel}`) {
        this.setState({
          redirectToDashboard: true
        })
      }
    }
  }

  render(){
    const { redirectToLogin, redirectToDashboard, location } = this.state
    const { user, user: { accessLevel }, mobile, view, displayNav, changeNav } = this.props
    if (redirectToLogin) return (<Redirect to="/login"/>)
    if (redirectToDashboard) return (<Redirect to="/"/>)
    return(
      <header>
        <img onClick={this.toDashboard} className="logo" src={logo_t} alt='logo'/>
        {
          mobile?
          <Bars changeNav={changeNav} open={displayNav}/>
          :
          user?
          <Fragment>

            {/* Nav */}
            <nav>
              <Link to={{pathname: `/${accessLevel}/events`, state: { nav: false }}}><h2>Jobs</h2></Link>
              {/* <Link to={{pathname: `/${accessLevel}/clients`, state: { nav: false }}}><h2>Clients</h2></Link> */}
              {/* <Link to={{pathname: `/${accessLevel}/invoices`, state: { nav: false }}}><h2>Invoices</h2></Link> */}
              <Link to={{pathname: `/${accessLevel}/staff`, state: { nav: false }}}><h2>Staff</h2></Link>
              <Link to={{pathname: `/${accessLevel}/inventory`, state: { nav: false }}}><h2>Inventory</h2></Link>
            </nav>

            {/* User Circle */}
            <div className="user-circle" onClick={this.logOut}>
              {
                user?
                <img className="user-photo" src={user.profile.picture} alt="You"/>
                :
                userCircleIcon('3x', { color: "var(--light-blue)" })
              }
            </div>

          </Fragment>
          :
          null
        }

        {/* Hamburger Drop Down */}

        {
          displayNav?
          <div className="Header--drop-down">

            <div className="Header--nav-menu" style={location && location.pathname === `/${accessLevel}`? {gridAutoFlow: 'row', gridRow: 'span 2', fontSize: '2em'} : {}}>
              <Link to={{pathname: `/${accessLevel}/events`, state: { nav: false }}} onClick={this.changeNav}><h3>Jobs</h3></Link>
              {/* <Link to={{pathname: `/${accessLevel}/clients`, state: { nav: false }}} onClick={this.changeNav}><h3>Clients</h3></Link> */}
              {/* <Link to={{pathname: `/${accessLevel}/invoices`, state: { nav: false }}} onClick={this.changeNav}><h3>Invoices</h3></Link> */}
              <Link to={{pathname: `/${accessLevel}/staff`, state: { nav: false }}} onClick={this.changeNav}><h3>Staff</h3></Link>
              <Link to={{pathname: `/${accessLevel}/inventory`, state: { nav: false }}} onClick={this.changeNav}><h3>Inventory</h3></Link>
            </div>

            {
              view !== "Dashboard"?
              <NavSection {...this.props}/>
              :
              null
            }

            {/* <button className="Header--Log-Out" onClick={this.logOut}>Log Out</button> */}

          </div>
          :
          null
        }

      </header>
    )
  }
}
