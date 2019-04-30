import React, { Component } from 'react'
import { timesIcon } from '../../helpers/icons'
import './index.css'

export default class Modal extends Component {
  render(){
    const { close, content } = this.props
    return (
      <div className="Modal--overlay" onClick={close}>
        <div className="Modal">
          <div onClick={close} className="Modal--close">{timesIcon('2x', 'gray')}</div>
          <div className="Modal--content">
            {content}
          </div>
        </div>

      </div>
    )
  }
}
