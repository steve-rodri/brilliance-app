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
      redirectToLogin: false
    }
  }

  logOut = () => {
    localStorage.removeItem('google_access_token')
    this.setState({
      redirectToLogin: true
    })
    this.props.removeUser()
  }

  render(){
    if (this.state.redirectToLogin) return (<Redirect to="/login"/>)
    return(
      <header>
        <img className="logo" src={logo_t} alt='logo'/>
        <nav>
          <Link to='/admin/events'>Events</Link>
          <Link to='/admin/clients'>Clients</Link>
          <Link to='/admin/invoices'>Invoices</Link>
          <Link to='/admin/staff'>Staff</Link>
          <Link to='/admin/inventory'>Inventory</Link>
          <Link to='/admin/run_sheets'>Run Sheets</Link>
        </nav>
        <div className="user-circle" onClick={this.logOut}><FontAwesomeIcon icon="user-circle" size="3x"/></div>
      </header>
    )
  }
}
