import React, { Component } from "react";
// import { timesIcon } from '../../helpers/icons'
import "./index.css";

export default class Modal extends Component {
  render() {
    const { show, close, content, mobile } = this.props;
    // const styleCloseIcon = () => {
    //   let style = {}
    //   if (closeIconColor) style.color = closeIconColor
    //   return style
    // }
    if (!show) return null;
    return (
      <div className="Modal--overlay" onClick={close}>
        <div className="Modal" onClick={e => e.stopPropagation()}>
          {/* <div onClick={close} style={styleCloseIcon()} className="Modal--close">{timesIcon('2x')}</div> */}
          <div className="Modal--content" onClick={e => e.stopPropagation()}>
            {content}
            {mobile ? <div className="Modal--mobile-space"></div> : null}
          </div>
        </div>
      </div>
    );
  }
}
