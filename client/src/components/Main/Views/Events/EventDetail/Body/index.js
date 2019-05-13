import React, { Component } from 'react'
import About from './About'
import Logistics from './Logistics'
import Notes from './Notes'
import Staff from './Staff'
import Invoice from './Invoice'
// import Loader from '../../../../../Loader'
import Buttons from '../../../../../Buttons/Buttons'
import { date, time } from '../../../../../../helpers/datetime'
import './index.css'

export default class Body extends Component {

  styleComp = (name) => {
    const { editMode } = this.props
    let style = {}
    if (editMode) {
      switch (name) {
        case 'About':
          style.gridRow = 'span 2'
          break;
        case 'Logistics':
          style.gridRow = 'span 2'
          break;
        case 'Notes':
          style.gridRow = 'span 2'
          break;
        case 'Staff':

          break;
        case 'Invoice':

          break;
        default:
          break;
      }
    }
    return style;
  }

  render(){
    const { mobile, editMode, fields, isNew } = this.props;
    const about = fields &&
    (fields.client || fields.location || date(fields) || time(fields));

    return (
      <div className="EventDetail-Body--container">
        <div className="EventDetail-Body--components-container">
          {
            about?
            <div className="EventDetail-Body--components">
                <About {...this.props} styleComp={this.styleComp}/>
              {
                mobile?
                null
                :
                <Logistics {...this.props} styleComp={this.styleComp}/>
              }
              {
                !mobile && !isNew?
                <Invoice {...this.props} styleComp={this.styleComp}/>
                :
                null
              }
                <Staff {...this.props} styleComp={this.styleComp}/>
              {
                editMode || !isNullOrWhitespace(fields.notes)?
                <Notes {...this.props} styleComp={this.styleComp}/>
                :
                null
              }
            </div>
            :
            // <div className="EventDetail-Body--loader">
            //   <Loader />
            // </div>
            null
          }
        </div>

        {
          mobile?
          <Buttons {...this.props}/>
          :
          null
        }

      </div>
    )
  }
}

function isNullOrWhitespace( input ) {
  if (typeof input === 'undefined' || input == null) return true;
  return input.replace(/\s/g, '').length < 1;
}
