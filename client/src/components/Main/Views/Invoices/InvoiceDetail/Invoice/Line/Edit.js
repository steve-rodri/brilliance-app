import React from 'react'
import { quantity, description, contents, price, inc } from './Helpers'
import { deleteIcon } from '../../../../../../Helpers/icons'

export default function Edit(props){
  const { inv, line, handleInc } = props
  const c = contents(line.item)
  return (
    <tr key={line.id} className="Line">
      <td className="Invoice--cell Line--add-delete">{deleteIcon('1x')}</td>

      <td className="Invoice--cell Line--quantity">
        <div>
          <input
            className="Line--input"
            name="quantity"
            type="number"
            value={quantity(line)}

          />
        </div>
      </td>

      <td className="Invoice--cell Line--item">
        <div className="Line--item-description"><p>{description(line.item)}</p></div>
        {c? <div className="Line--item-contents">{c}</div> : null}
      </td>

      <td
        className="Invoice--cell Line--inc"
        onClick={(e) => {
          e.stopPropagation()
          handleInc(line.id, line.inc)
        }}
      >
        {inc(line)}
      </td>

      <td className="Invoice--cell Line--price">
        <div>
          <p>$</p>
          <input
            className="Line--input"
            name="price"
            type="number"
            value={price(line, inv.kind)}

          />
        </div>
      </td>
    </tr>
  )
}
