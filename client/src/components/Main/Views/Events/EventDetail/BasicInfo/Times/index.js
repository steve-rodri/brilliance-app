import React, { Component } from 'react'
import Edit from './Edit'
import './index.css'

export default class Times extends Component {

  view = () => {
    const { editMode } = this.props

    if (editMode) {

      return (
        <Edit
        {...this.props}
        />
      )

    } else {
      return (
        <div></div>
      )
    }
  }

  render(){
    return (
      <div className="BasicInfo--component">
        <h3 className="BasicInfo--component-title">Times</h3>
          <div className="Times--container">
            {this.view()}
          </div>
      </div>
    )
  }
}
