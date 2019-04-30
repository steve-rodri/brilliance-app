import React, { Component } from 'react'
import { description, contents, inc } from './Helpers'
import { timesIcon } from '../../../../../../../helpers/icons'

export default class Edit extends Component {

  handleFocusSelect = (e) => {
    e.target.select()
  }

  render(){
    const { line, index, length, styleCell, handleLineChange, deleteLine } = this.props
    const c = contents(line.item)
    return (
      <tr key={line.id} className="Line">
        <td
          style={styleCell(index, length, 'delete')}
          className="Invoice--cell Line--add-delete"
          onClick={(e) => {
            e.stopPropagation();
            deleteLine(line.id)
          }}
        >
          {timesIcon('2x')}
        </td>

        <td style={styleCell(index, length, 'quantity')} className="Invoice--cell Line--quantity">
            <input
              className="Line--input"
              name="quantity"
              type="number"
              value={line.quantity || ''}
              onChange={(e) => handleLineChange(e, line.id)}
              onFocus={this.handleFocusSelect}
            />
        </td>

        <td style={styleCell(index, length)} className="Invoice--cell Line--item">
          <div className="Line--item-description"><p>{description(line.item)}</p></div>
          {c? <div className="Line--item-contents">{c}</div> : null}
        </td>

        <td
          style={styleCell(index, length)}
          className="Invoice--cell Line--inc"
          onClick={(e) => {
            e.stopPropagation()
            handleLineChange(e, line.id, 'inc')
          }}
        >
          {inc(line)}
        </td>

        <td style={styleCell(index, length, 'price')} className="Invoice--cell Line--price">
          {
            !line.inc?
            <div>
              <p>$</p>
              <input
                className="Line--input"
                style={{width: '100%'}}
                name="price"
                type="number"
                value={line.price || ''}
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
