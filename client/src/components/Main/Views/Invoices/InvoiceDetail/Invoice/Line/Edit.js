import React, { Component } from 'react'
import { description, contents, inc } from './Helpers'
import { deleteIcon } from '../../../../../../../helpers/icons'

export default class Edit extends Component {

  handleFocusSelect = (e) => {
    e.target.select()
  }

  render(){
    const { line, handleLineChange, deleteLine } = this.props
    const c = contents(line.item)
    return (
      <tr key={line.id} className="Line">
        <td
          className="Invoice--cell Line--add-delete"
          onClick={(e) => {
            e.stopPropagation();
            deleteLine(line.id)
          }}
        >
          {deleteIcon('1x')}
        </td>

        <td className="Invoice--cell Line--quantity">
          <div>
            <input
              className="Line--input"
              name="quantity"
              type="number"
              value={line.quantity}
              onChange={(e) => handleLineChange(e, line.id)}
              onFocus={this.handleFocusSelect}
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
            handleLineChange(e, line.id, 'inc')
          }}
        >
          {inc(line)}
        </td>

        <td className="Invoice--cell Line--price">
          {
            !line.inc?
            <div>
              <p>$</p>
              <input
                className="Line--input"
                name="price"
                type="number"
                value={line.price}
                onChange={(e) => handleLineChange(e, line.id)}
                onFocus={this.handleFocusSelect}
              />
            </div>
            :
            null
          }
        </td>
      </tr>
    )
  }
}
