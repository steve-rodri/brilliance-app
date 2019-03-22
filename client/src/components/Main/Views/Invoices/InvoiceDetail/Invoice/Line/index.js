import React, { Component } from 'react'
import Edit from './Edit'
import Show from './Show'
import './index.css'

export default class Line extends Component {

  render(){
    const { editMode } = this.props

    if (editMode) {
      return (
        <Edit
          {...this.props}

        />
      )
    } else {
      return (
        <Show
          {...this.props}
        />
      )
    }
  }
}
