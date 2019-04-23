import React, { Component } from 'react'
import Create from './Create'
import Show from './Show'
import './Modal.css'

export default class Modal extends Component {

  componentDidMount(){
    this.props.doNotRefresh()
  }

  render(){
    const { closeModal, match, history, location, prevLocation, type } = this.props
    const back = e => {
      e.stopPropagation();
      closeModal();
      if (location !== prevLocation) {
        history.goBack();
      } else {
        const words = (match.url).split('/')
        words.pop()
        const url = words.join('/')
        history.push(url)
      }
    };
    return (
      <div
        onClick={back}
        className="Client-Modal--Overlay"
      >
        <div className="Client-Modal" onClick={e => e.stopPropagation()}>
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
