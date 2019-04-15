import React from 'react'
import numeral from 'numeral'
import { quantity, description, contents, price } from './Helpers'

export default function Show(props){
  const { inv, line } = props
  const p = price(line, inv.kind)
  const c = contents(line.item)
  return (
    <tr key={line.id} className="Line">
      <td className="Invoice--cell Line--quantity"><p>{quantity(line)}</p></td>
      <td className="Invoice--cell Line--item">
        <div className="Line--item-description"><p>{description(line.item)}</p></div>
        {c? <div className="Line--item-contents">{c}</div> : null}
      </td>
      <td className="Invoice--cell Line--price">{p > 0? numeral(p).format('$0,0.00') : null }</td>
    </tr>
  )
}
