import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import Bars from '../Buttons/Bars/index.js'
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
      redirectToDashboard: false,
      displayNav: false
    }
  }

  componentWillReceiveProps(nextProps){
    const { location } = nextProps
    this.setState({ location })
  }

  async componentDidMount() {
    this.updateNav();
    window.addEventListener("resize", this.updateNav);
    const user = await this.props.getUser();
    if (user) {
      this.setState({ user })
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateNav);
  }

  updateNav = (e) => {
    if (window.innerWidth > 1000) {
      this.setState({ displayNav: false })
    }
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

  changeNav = () => {
    this.setState({
      displayNav: !this.state.displayNav
    })
  }

  styleNav(){
    if (this.state.displayNav) {
      return { display: 'grid'}
    } else {
      return { display: 'none'}
    }
  }

  render(){
    const { user, redirectToLogin, redirectToDashboard } = this.state
    if (redirectToLogin) return (<Redirect to="/login"/>)
    if (redirectToDashboard) return (<Redirect to="/"/>)

    return(
      <div>
        <header>

          <img onClick={this.toDashboard} className="logo" src={logo_t} alt='logo'/>

          <Bars changeNav={this.changeNav} open={this.state.displayNav}/>

          <nav>
            <Link to='/admin/events'><div>Jobs</div></Link>
            {/* <Link to='/admin/clients'><div>Clients</div></Link> */}
            {/* <Link to='/admin/invoices'><div>Invoices</div></Link> */}
            <Link to='/admin/staff'><div>Staff</div></Link>
            <Link to='/admin/inventory'><div>Inventory</div></Link>
          </nav>

          <div className="user-circle" onClick={this.logOut}>
            {
              user?
              <img className="user-photo" src={user.picture} alt="You"/>
              :
              <FontAwesomeIcon icon="user-circle" size="3x" color="var(--light-blue)"/>
            }
          </div>

        </header>

        <div className="Header--fixed-space"></div>

        <div className="Header--drop-down" style={this.styleNav()}>

          <div className="Header--nav-menu">
            <Link to='/admin/events' onClick={this.changeNav}><div>Jobs</div></Link>
            {/* <Link to='/admin/clients' onClick={this.changeNav}><div>Clients</div></Link> */}
            {/* <Link to='/admin/invoices' onClick={this.changeNav}><div>Invoices</div></Link> */}
            <Link to='/admin/staff' onClick={this.changeNav}><div>Staff</div></Link>
            <Link to='/admin/inventory' onClick={this.changeNav}><div>Inventory</div></Link>
          </div>

          <button className="Header--Log-Out" onClick={this.logOut}>Log Out</button>

        </div>

      </div>
    )
  }
}
