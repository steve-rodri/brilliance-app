import React from 'react'
import { Link } from 'react-router-dom'
import { plusIcon } from '../../../helpers/icons'
import './index.css'

export default function AddNew(props){
  const { linkPath, style } = props
  return (
    <Link
      to={linkPath}
      style={{...style, textDecoration: 'none', color: 'black', width: '100%'}}
    >

      <div className="AddNew">
        <span className="AddNew--button-text">Add New</span>
        {plusIcon('2x', 'AddNew--button-icon')}
      </div>

    </Link>
  )
}
