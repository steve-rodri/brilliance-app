import React, { Component } from 'react'
import View from './View'
import Edit from './Edit'
import './index.css'

export default class About extends Component {

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
        <View
          {...this.props}
        />
      )

    }
  }

  render(){
    return (
      <div className="BasicInfo--component">
        <h3 className="BasicInfo--component-title">About</h3>
          <div className="About--container">
            {this.view()}
          </div>
      </div>
    )
  }
}
