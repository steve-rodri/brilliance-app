import React from 'react'
import { Link } from 'react-router-dom'
import { plusIcon } from '../../../helpers/icons'
import './index.css'

export default function AddNew(props){
  const { linkPath, className, type } = props
  return (
    <Link
      to={linkPath}
      className={className}
      style={{textDecoration: 'none', color: 'black'}}
    >

      <div className="AddNew">
        <span className="AddNew--button-text">{`New ${type}`}</span>
        {plusIcon('2x', 'AddNew--button-icon')}
      </div>

    </Link>
  )
}
