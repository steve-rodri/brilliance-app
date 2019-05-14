import React, { Component } from 'react'
import { timesIcon } from '../../helpers/icons'
import './index.css'

export default class Modal extends Component {
  render(){
    const { close, closeIconColor, content } = this.props
    const styleCloseIcon = () => {
      let style = {}
      if (closeIconColor) style.color = closeIconColor
      return style
    }
    return (
      <div className="Modal--overlay" onClick={close}>
        <div className="Modal" onClick={e => e.stopPropagation()}>
          <div onClick={close} style={styleCloseIcon()} className="Modal--close">{timesIcon('2x')}</div>
          <div className="Modal--content" onClick={e => e.stopPropagation()}>
            {content}
          </div>
        </div>

      </div>
    )
  }
}
