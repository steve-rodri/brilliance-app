import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import logo_t from '../../images/logo_t.GIF'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import './Header.css'

library.add(faUserCircle)

export default class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToLogin: false,
      redirectToDashboard: false
    }
  }

  componentWillReceiveProps(nextProps){
    const { location } = nextProps
    this.setState({ location })
  }

  logOut = () => {
    localStorage.clear()
    this.setState({
      redirectToLogin: true
    })
  }

  toDashboard = () => {
    const { location } = this.state
    if (location) {
      if (location.pathname !== '/admin') {
        this.setState({
          redirectToDashboard: true
        })
      }
    }
  }

  render(){
    const { redirectToLogin, redirectToDashboard } = this.state
    if (redirectToLogin) return (<Redirect to="/login"/>)
    if (redirectToDashboard) return (<Redirect to="/admin"/>)
    return(
      <header>
        <img onClick={this.toDashboard} className="logo" src={logo_t} alt='logo'/>
        <nav>
          <Link to='/admin/events'><div>Events</div></Link>
          <Link to='/admin/clients'><div>Clients</div></Link>
          <Link to='/admin/invoices'><div>Invoices</div></Link>
          <Link to='/admin/staff'><div>Staff</div></Link>
          <Link to='/admin/inventory'><div>Inventory</div></Link>
        </nav>
        <div className="user-circle" onClick={this.logOut}><FontAwesomeIcon icon="user-circle" size="3x"/></div>
      </header>
    )
  }
}
