import React, { Component } from 'react'
import ReactModal from 'react-modal';
import Header from '../Header/index.js'
import Search from '../Search/index.js'
import Schedule from '../Schedule/index.js'
import { Route, Redirect } from 'react-router-dom'
import './Dashboard.css'

export default class Dashboard extends Component {
  constructor (props){
    super(props)
    this.state = {
      modalIsOpen: false,
      redirectToLogin: false
    }
  }

  componentWillMount(){
    const token = localStorage.getItem('google_access_token')
    if (!token) {
      this.setState({
        redirectToLogin: true
      })
    }
  }

  render(){

    if (this.state.redirectToLogin) return (<Redirect to='/login' />)
    const user = this.props.user
    return (
      <div>
        <Header removeUser={this.props.removeUser}/>
        <h1>Welcome {user && user.givenName}!</h1>
        <Schedule user={user}/>
      </div>
    )
  }

  openUserModal(){
    this.setState({
      modalIsOpen: true
    })
  }

  handleRequestCloseFunc(){
    this.setState({
      modalIsOpen: false
    })
  }
}

// <ReactModal
//   isOpen={this.state.modalIsOpen}
//   onAfterOpen={this.handleAfterOpenFunc}
//   onRequestClose={this.handleRequestCloseFunc}
//   style={{ overlay: {}, content: {} }}
//   contentLabel="Example Modal"
//   portalClassName="User-Portal-Modal"
//   overlayClassName="ReactModal__Overlay"
//   className="User-Portal-Modal__Content"
//   shouldFocusAfterRender={true}
//   shouldCloseOnOverlayClick={true}
//   shouldCloseOnEsc={true}
//   shouldReturnFocusAfterClose={false}
//   role="dialog"
//   parentSelector={() => document.body}
// />
