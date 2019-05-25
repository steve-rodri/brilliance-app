import React, { Component } from 'react'
import About from './About'
import Logistics from './Logistics'
import Notes from './Notes'
import Staff from './Staff'
import Invoice from './Invoice'
// import Loader from '../../../../../Loader'
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

  styleComponents = () => {
    const { editMode, mobile } = this.props
    if (!mobile) {
      let style = {
        gridAutoColumns: "minmax(16.25rem, 1fr)",
        gridAutoRows: "minmax(14.5rem, 1fr)",
        gridTemplateColumns: "repeat(auto-fit, minmax(17.25rem, auto))",
      };

      if (editMode) {
        style.gridAutoColumns = "auto";
        style.gridAutoRows = "auto";
        style.gridTemplateColumns = "repeat(auto-fit, minmax(21rem, auto))";
      }

      return style;
    } else {
      return {}
    }
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
            // <div className="EventDetail-Body--loader">
            //   <Loader />
            // </div>
            null
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
