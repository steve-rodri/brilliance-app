import React from 'react'
import './Bars.css'

export default function Bars(props){
  function styleFirst(){
    if (props.open) {
      return {
        transform: 'translateY(15px) rotate(45deg)',
        transition: 'all 200ms ease',
      }
    } else {
      return {}
    }
  }

  function styleSecond(){
    if (props.open) {
      return {
        opacity: '0',
        transition: 'all 200ms ease',
      }
    } else {
      return {}
    }
  }

  function styleThird(){
    if (props.open) {
      return {
        transform: 'translateY(-15px) rotate(-45deg)',
        transition: 'all 200ms ease',
      }
    } else {
      return {}
    }
  }

  return (
    <div className="Header--Bars wrapper" onClick={() => props.changeNav(!props.open)}>
      <div className="bars">
        <div className="first" style={styleFirst()}></div>
        <div className="second" style={styleSecond()}></div>
        <div className="third" style={styleThird()}></div>
      </div>
    </div>
  )
}
