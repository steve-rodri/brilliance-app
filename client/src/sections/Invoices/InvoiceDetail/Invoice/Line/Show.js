import React from 'react'
import numeral from 'numeral'
import { itemDescription, itemContents } from './Helpers'

export default function Show(props){
  const { line, index, length, styleCell, mobile, showQty } = props
  const c = itemContents(line.item)
  return (
    <tr key={line.id} className="Line">
      {showQty? <td style={styleCell(index, length)} className="Invoice--cell Line--quantity"><p>{line.quantity}</p></td> : null}
      <td style={styleCell(index, length)} className="Invoice--cell Line--item">
        <div className="Line--item-description"><p>{itemDescription(line.item)}</p></div>
        {c? <div className="Line--item-contents">{c}</div> : null}
      </td>
      {!mobile? <td style={styleCell(index, length)} className="Invoice--cell Line--price"><p>{line.price > 0? numeral(line.price).format('$0,0.00') : null }</p></td> : null}
    </tr>
  )
}
