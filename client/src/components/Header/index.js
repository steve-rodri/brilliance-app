import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
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
            <Link to='/admin/events'><h2>Jobs</h2></Link>
            {/* <Link to='/admin/clients'><h2>Clients</h2></Link> */}
            {/* <Link to='/admin/invoices'><h2>Invoices</h2></Link> */}
            <Link to='/admin/staff'><h2>Staff</h2></Link>
            <Link to='/admin/inventory'><h2>Inventory</h2></Link>
          </nav>

          <div className="user-circle" onClick={this.logOut}>
            {
              user?
              <img className="user-photo" src={user.picture} alt="You"/>
              :
              userCircleIcon('3x', { color: "var(--light-blue)" })
            }
          </div>

        </header>



        <div className="Header--drop-down" style={this.styleNav()}>

          <div className="Header--nav-menu">
            <Link to='/admin/events' onClick={this.changeNav}><h2>Jobs</h2></Link>
            {/* <Link to='/admin/clients' onClick={this.changeNav}><h2>Clients</h2></Link> */}
            {/* <Link to='/admin/invoices' onClick={this.changeNav}><h2>Invoices</h2></Link> */}
            <Link to='/admin/staff' onClick={this.changeNav}><h2>Staff</h2></Link>
            <Link to='/admin/inventory' onClick={this.changeNav}><h2>Inventory</h2></Link>
          </div>

          <button className="Header--Log-Out" onClick={this.logOut}>Log Out</button>

        </div>

      </div>
    )
  }
}
