import React, { Component } from 'react'
import Create from './Create'
import Show from './Show'
import './Modal.css'

export default class Modal extends Component {

  render(){
    const { history, type } = this.props
    const back = e => {
      e.stopPropagation();
      history.goBack();
    };
    return (
      <div
        onClick={back}
        className="Modal--Overlay"
      >
        <div className="Modal">
          {type === 'Create'?
            <Create
              {...this.props}
            />
            :
            <Show
              {...this.props}
            />
          }
        </div>
      </div>
    );
  }
}
