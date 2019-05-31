import React from 'react'
import { Link } from 'react-router-dom'
import { checkIcon, timesIcon } from '../../../helpers/icons'
import './index.css'

export default function Staff(props){
  const { user: { accessLevel }, item, view, displayColumn, numColumns, styleItem, styleCell  } = props
  const employee = item
  const leftCell = styleCell('left', employee)
  const middleCell = styleCell('middle', employee)
  const rightCell = styleCell('right', employee)
  const nameDisplay = displayColumn('name')
  const activeDisplay = displayColumn('active')
  const laborDisplay = displayColumn('labor')

  const style = (bool) => {
    if (bool) {
      return (
        {
          backgroundColor: 'limegreen',
          color: '#eee'
        }
      )
    } else {
      return (
        {
          backgroundColor: 'red',
          color: '#eee'
        }
      )
    }
  }

  return (
    <Link to={`/${accessLevel}/${view.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(item, view, numColumns)}>

          {/* Name */}
          <div className="Staff--name" style={{ ...leftCell, ...nameDisplay }}>
            <h3>{employee.contactInfo.fullName}</h3>
          </div>

          {/* Active */}
          <div className="Staff--active" style={{ ...middleCell, ...activeDisplay }}>
            <div style={style(employee.active)}>
              <h4>{employee.active? checkIcon() : timesIcon() }</h4>
            </div>
          </div>

          {/* Labor */}
          <div className="Staff--labor" style={{ ...rightCell, ...laborDisplay }}>
            <div style={style(employee.labor)}>
              <h4>{employee.labor? checkIcon() : timesIcon() }</h4>
            </div>
          </div>

        </div>
        :
        <div className="List-Item">

          <div className="Staff--name">
            <h3>{employee.contactInfo.fullName}</h3>
          </div>

        </div>
      }
    </Link>
  )
}
