import React, { Component } from 'react'
import { itemDescription, itemContents, inc } from './Helpers'
// import { timesIcon } from '../../../../../../../helpers/icons'
import { ReactComponent as TimesIcon } from '../../../../../../../icons/Close.svg'

export default class Edit extends Component {

  handleFocusSelect = (e) => {
    e.target.select()
  }

  render(){
    const { mobile, line, index, length, styleCell, handleLineChange, deleteLine } = this.props
    const c = itemContents(line.item)
    return (
      <tr key={line.id} className="Line">

      {/* Add - Delete */}
        <td
          style={styleCell(index, length, 'delete')}
          className="Invoice--cell Line--add-delete"
          onClick={(e) => {
            e.stopPropagation();
            deleteLine(line.id)
          }}
        >
          {<TimesIcon width="25" height="25"/>}
        </td>

        {/* Quantity */}
        {
          !mobile?
          <td style={styleCell(index, length, 'quantity')} className="Invoice--cell Line--quantity">
            <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
              <input
                autoComplete="off"
                className="Line--input"
                name="quantity"
                type="number"
                value={line.quantity || ''}
                onChange={(e) => handleLineChange(e, line.id)}
                onFocus={this.handleFocusSelect}
              />
            </form>
          </td>
          :
          null
        }

        {/* Item */}
        <td style={styleCell(index, length)} className="Invoice--cell Line--item">
          <div className="Line--item-description"><p>{itemDescription(line.item)}</p></div>
          {c? <div className="Line--item-contents">{c}</div> : null}
        </td>

        {/* Inc */}
        {
          !mobile?
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
          :
          null
        }

        {/* Price */}
        {
          !mobile?
          <td style={styleCell(index, length, 'price')} className="Invoice--cell Line--price">
            {
              !line.inc?
              <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                <h2>$</h2>
                <input
                  className="Line--input"
                  style={{width: '100%'}}
                  name="price"
                  type="number"
                  value={line.price || ''}
                  onChange={(e) => handleLineChange(e, line.id)}
                  onFocus={this.handleFocusSelect}
                />
              </form>
              :
              null
            }
          </td>
          :
          null
        }
      </tr>
    )
  }
}
