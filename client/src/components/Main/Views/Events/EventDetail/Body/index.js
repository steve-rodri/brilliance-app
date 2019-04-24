import React, { Component } from 'react'
import About from './About'
import Logistics from './Logistics'
import Notes from './Notes'
import Staff from './Staff'
import Invoice from './Invoice'
import Buttons from '../../../../../Buttons/Buttons'
import { date, time } from '../../../../../../helpers/datetime'
import './index.css'

export default class Body extends Component {
  render(){
    const { mobile, fields } = this.props;
    const about = fields &&
    (fields.client || fields.location || date(fields) || time(fields));

    return (
      <div className="EventDetail-Body--container">
        <div className="EventDetail-Body--components-container">
          <div className="EventDetail-Body--components">
            {
              about?
              <About {...this.props} />
              :
              null
            }
            {
              mobile?
              null
              :
              <Logistics {...this.props}/>
            }
            {
              about?
              <Invoice {...this.props}/>
              :
              null
            }
            {
              about?
              <Staff {...this.props}/>
              :
              null
            }
            {
              about && !isNullOrWhitespace(fields.notes)?
              <Notes {...this.props} />
              :
              null
            }
          </div>
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
