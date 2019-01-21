import React, { Component } from 'react'
import Standard from './Standard'
import Edit from './Edit'
import './index.css'

export default class MainInfo extends Component {
  
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
        <Standard
          {...this.props}
        />
      )
    }
  }

  render(){
    return this.view()
  }
}
