import React, { Component } from 'react'
import ReactModal from 'react-modal';
import Header from '../Header/index.js'
import Search from '../Search/index.js'
import Schedule from '../Schedule/index.js'
import './Dashboard.css'

export default class Dashboard extends Component {
  render(){
    const { user, location } = this.props
    return (
      <div>
      <Header location={location}/>
      <h1>Welcome {user.givenName}!</h1>
      <Schedule user={user}/>
      </div>
    )
  }
}


// constructor (props){
//   super(props)
//   this.state = {
//     modalIsOpen: false,
//   }
// }
//
// openUserModal(){
//   this.setState({
//     modalIsOpen: true
//   })
// }
//
// handleRequestCloseFunc(){
//   this.setState({
//     modalIsOpen: false
//   })
// }
//
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
