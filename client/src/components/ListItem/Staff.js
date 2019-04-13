import React from 'react'
import { Link } from 'react-router-dom'
import './Staff.css'

export default function Staff(props){
  const { item, type, displayColumn, numColumns, styleItem  } = props
  const employee = item

  return (
    <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(item, type, numColumns)}>

          <div className="Staff--name" style={displayColumn('name')}>
            <h3>{employee.contactInfo.fullName}</h3>
          </div>

          <h4 style={displayColumn('active')}>{employee['active?']? 'Yes': 'No'}</h4>

          <div className="Staff--labor" style={displayColumn('labor')}>
            <h3>{employee['labor?']? 'Yes': 'No'}</h3>
          </div>
        </div>
        :
        <div className="List-Item">

          <div className="Staff--name">
            <h3>{employee.name}</h3>
          </div>

        </div>
      }
    </Link>
  )
}
