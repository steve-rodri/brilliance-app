import React from 'react'
import { Link } from 'react-router-dom'

export default function Invoice(props){
  const { item, type, numColumns, styleColumns  } = props
  const invoice = item
  return (
    <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleColumns(numColumns)}>
        <div></div>
        <h4>{invoice.kind}</h4>
        <div className="List-Item--status">
          <h3>{invoice.payment_status}</h3>
          <h4>{invoice.payment_type}</h4>
        </div>
      </div>
    </Link>
  )
}
