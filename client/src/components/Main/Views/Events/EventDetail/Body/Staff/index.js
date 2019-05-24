import React, { Component } from 'react'
import Edit from './Edit'
import View from './View'
import './index.css'

export default class Staff extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  iconSize = () => {
    const { mobile } = this.props
    if (mobile) {
      return '2x'
    } else {
      return '2x'
    }
  }

  status = (confirmation) => {
    let style = {}
    switch (confirmation) {
      case 'needsAction':
        style.color = "var(--dark-gray)"
      break;
      case 'Unconfirmed':
      case 'accepted':
        style.backgroundColor = "limegreen"
        style.color = "white"
      break;
      case 'Confirmed':
        style.backgroundColor = "limegreen"
        style.color = "white"
      break;
      case 'tentative':
        style.backgroundColor = "gold"
        style.color = "var(--light-gray)"
      break;
      case 'declined':
        style.backgroundColor = "red"
        style.color = "white"
      break;
      default:
      break;
    }
    return style;
  }

  view = () => {
    const { mobile, editMode, workers } = this.props
    if (editMode) {
      return (
        <Edit
          {...this.props}
          iconSize={this.iconSize()}
          status={this.status}
        />
      )
    } else if (workers && workers.length) {
      return (
        <View
          {...this.props}
          iconSize={this.iconSize()}
          status={this.status}
        />
      )
    } else {
      return (
        <div className="Staff--container">
          {mobile? <label>Staff</label> : null }
          <div className="Staff--none">
            <p>No one has been scheduled</p>
            <p>to work this event...</p>
          </div>
        </div>
      )
    }
  }

  render(){
    const { styleComp } = this.props
    return (
      <div style={styleComp('Staff')}className="EventDetail-Body--component EventDetail-Body--staff">
        <div className="EventDetail-Body--component-title"><h4>Staff</h4></div>
          {this.view()}
      </div>
    )
  }
}
