import React, { Component } from 'react'
import { timesIcon } from '../../helpers/icons'
import './index.css'

export default class Modal extends Component {
  render(){
    const { close, content } = this.props
    return (
      <div className="Modal--overlay" onClick={close}>
        <div className="Modal" onClick={e => e.stopPropagation()}>
          <div onClick={close} className="Modal--close">{timesIcon('2x', 'gray')}</div>
          <div className="Modal--content" onClick={e => e.stopPropagation()}>
            {content}
          </div>
        </div>

      </div>
    )
  }
}
