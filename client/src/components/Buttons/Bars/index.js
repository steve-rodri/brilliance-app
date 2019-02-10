import React from 'react'
import './Bars.css'

export default function Bars(props){
  function styleFirst(){
    if (props.open) {
      return {
        transform: 'translateY(17px) rotate(45deg)',
        transition: 'all 0.5s ease',
      }
    } else {
      return {}
    }
  }

  function styleSecond(){
    if (props.open) {
      return {
        opacity: '0',
        transition: 'all 0.2s ease',
      }
    } else {
      return {}
    }
  }

  function styleThird(){
    if (props.open) {
      return {
        transform: 'translateY(-17px) rotate(-45deg)',
        transition: 'all 0.5s ease',
      }
    } else {
      return {}
    }
  }

  return (
    <div className="Header--Bars wrapper" onClick={props.changeNav}>
      <div className="bars">
        <div className="first" style={styleFirst()}></div>
        <div className="second" style={styleSecond()}></div>
        <div className="third" style={styleThird()}></div>
      </div>
    </div>
  )
}
