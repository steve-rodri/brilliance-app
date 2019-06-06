import React from 'react'
import { Link } from 'react-router-dom'
import { plusIcon } from '../../../helpers/icons'
import './index.css'

export default function AddNew(props){
  const { linkPath, className, style, type } = props
  return (
    <Link
      to={linkPath}
      className={className}
      style={{textDecoration: 'none', color: 'black', ...style}}
    >

      <button className="AddNew">
        <h3 className="AddNew--button-text">{`New ${type}`}</h3>
        {plusIcon('2x', 'AddNew--button-icon')}
      </button>

    </Link>
  )
}
