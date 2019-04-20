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
    const { editMode } = this.props
    return (
      <Fragment>
        { editMode?
          <div className="BasicInfo--component BasicInfo--logistics">
            <div className="BasicInfo--component-title"><h3>Logistics</h3></div>
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
