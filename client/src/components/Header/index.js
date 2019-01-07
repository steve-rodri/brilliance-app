import React from 'react';
import { Link } from 'react-router-dom'
import logo_t from '../../images/logo_t.GIF'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import './Header.css'

library.add(faUserCircle)

export default function Header(){
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
      <div className="user-circle"><FontAwesomeIcon icon="user-circle" size="3x"/></div>
    </header>
  )
}
