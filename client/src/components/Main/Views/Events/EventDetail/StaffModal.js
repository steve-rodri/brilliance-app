import React, { Component } from 'react'
import StaffSelector from './BasicInfo/Staff/StaffSelector'
// import { closeIcon } from '../../../../Helpers/icons'
import './StaffModal.css'

export default class StaffModal extends Component {
  render(){
    const { close } = this.props
    return (
      <div className="StaffModal--overlay" onClick={close}>
        <div className="StaffModal">
          <div className="StaffModal--content">
            {/* <div onClick={close} className="StaffModal--close">{closeIcon('2x', 'gray')}</div> */}
            <StaffSelector {...this.props}/>
            <button className="StaffModal--done BasicInfo--button" onClick={close}>DONE</button>
          </div>
        </div>

      </div>
    )
  }
}
