import React, { Component } from 'react'
import Standard from './Standard'
import StandardMobile from './StandardMobile';
import Edit from './Edit'
import EditMobile from './EditMobile'
import './index.css'

export default class MainInfo extends Component {

  view = () => {
    const { editMode, mobile } = this.props
    
    if (editMode) {
      if (mobile) {
        return (
          <EditMobile
          {...this.props}
          />
        )
      } else {
        return (
          <Edit
          {...this.props}
          />
        )
      }
    } else {
      if (mobile) {
        return (
          <StandardMobile
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
  }

  render(){
    return this.view()
  }
}
