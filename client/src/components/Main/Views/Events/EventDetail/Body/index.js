import React, { Component } from 'react'
import About from './About'
import Logistics from './Logistics'
import Notes from './Notes'
import Staff from './Staff'
import Invoice from './Invoice'
import Loader from '../../../../../Loader'
import { date, time } from '../../../../../../helpers/datetime'
import './index.css'

export default class Body extends Component {

  styleComp = (name) => {
    const { editMode } = this.props
    let style = {}
    if (editMode) {
      switch (name) {
        case 'About':
          break;
        case 'Logistics':
          break;
        case 'Notes':
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

  styleComponents = () => {
    const { editMode, mobile } = this.props
    let style = {};
    if (!mobile) {
      style.gridTemplateColumns = "repeat(auto-fit, minmax(17.25rem, auto))"
      if (editMode) {
        style.gridTemplateColumns = "repeat(auto-fit, minmax(21rem, auto))";
      }
    }
    return style;
  }

  render(){
    const { evt, mobile, editMode, fields, isNew } = this.props;
    const about = fields &&
    (fields.client || fields.location || date(fields) || time(fields));

    const showInvoice = !isNew && evt && !editMode
    const showStaff = editMode || ( evt && evt.staff && evt.staff.length )

    return (
      <main>
        <div className="EventDetail-Body--components-container">
          {
            about?
            <div className="EventDetail-Body--components" style={this.styleComponents()}>
                <About {...this.props} styleComp={this.styleComp}/>
              {
                mobile?
                null
                :
                <Logistics {...this.props} styleComp={this.styleComp}/>
              }
              {
                showStaff?
                <Staff {...this.props} styleComp={this.styleComp}/>
                :
                null
              }
              {
                editMode || !isNullOrWhitespace(fields.notes)?
                <Notes {...this.props} styleComp={this.styleComp}/>
                :
                null
              }
              {
                showInvoice?
                <Invoice {...this.props} styleComp={this.styleComp}/>
                :
                null
              }
            </div>
            :
            <div className="EventDetail-Body--loader">
              <Loader />
            </div>

          }
        </div>
      </main>
    )
  }
}

function isNullOrWhitespace( input ) {
  if (typeof input === 'undefined' || input == null) return true;
  return input.replace(/\s/g, '').length < 1;
}
