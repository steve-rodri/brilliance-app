import React, { Component, Fragment } from 'react'
import Edit from './Edit'
import './index.css'

export default class Logistics extends Component {

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
    const { editMode, styleComp } = this.props
    return (
      <Fragment>
        { editMode?
          <div style={styleComp('Logistics')}className="EventDetail-Body--component EventDetail-Body--logistics">
            <div className="EventDetail-Body--component-title"><h4>Logistics</h4></div>
              <div className="Logistics--container">
                {this.view()}
              </div>
          </div>
          :
          null
        }
      </Fragment>
    )
  }
}
