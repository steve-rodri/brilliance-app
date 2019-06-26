import React, { Component } from 'react'
import Line from './Line/index.js'
import { plusIcon } from '../../../../../../helpers/icons'
import './index.css'

export default class Invoice extends Component {

  styleCell = (index, length, type) => {
    const style = {}

    switch (type) {
      case 'delete':
        break;
      case 'quantity':
        break;
      case 'price':
        style.padding = 0
        break;
      default:
        break;
    }

    if ( index === 0 ) {
      style.borderTop = 'none'
    } else if ( index + 1 === length ) {
      style.borderBottom = 'none'
    }

    return style
  }

  lines = () => {
    const { inv } = this.props
    if (inv && inv.lines) {
      const lines = [...inv.lines]
      return lines.map( (line, i) =>
        <Line
          {...this.props}
          line={line}
          index={i}
          key={line.id}
          length={lines.length}
          styleCell={this.styleCell}
          showQty={this.quantities()}
        />
      )
    }
  }

  quantities = () => {
    const { inv } = this.props
    let bool = false;
    if (inv && inv.lines && inv.lines.length) {
      inv.lines.forEach(line => {
        if (line.quantity) {
          bool = true
        }
      })
    }
    return bool;
  }

  header = () => {
    const { inv, editMode, mobile } = this.props
    if (inv) {
      if (editMode || (inv.lines && inv.lines.length)) {
        return (
          <thead className="Invoice--header">
            <tr className= "Invoice--header-row">
              {editMode? <th className="Invoice--header-cell Invoice--header-edit"></th> : null}
              {(editMode && !mobile) || (!editMode && this.quantities())? <th className="Invoice--header-cell Invoice--header-quantity"><h4>Qty</h4></th> : null}
              <th className="Invoice--header-cell Invoice--header-item"><h4>Item</h4></th>
              {editMode && !mobile? <th className="Invoice--header-cell Invoice--header-inc"><h4>Inc</h4></th> : null}
              {!mobile? <th className="Invoice--header-cell Invoice--header-price"><h4 style={editMode? {textAlign: 'center'} : {textAlign: 'right'}}>Price</h4></th> : null}
            </tr>
          </thead>
        )
      } else if (!mobile){
        return (
          <thead>
            <tr>
              <td style={{color: 'var(--light-gray)'}}>
                <p>{`There are no items added to this ${inv.kind}.`}</p>
                <p>Add items by clicking the pencil icon at the top right corner of this screen.</p>
              </td>
            </tr>
          </thead>
        )
      }
    }
  }

  render(){
    const { editMode, addLine } = this.props
    return (
      <div className="Invoice--container">
        <div className="Invoice">

          <table>

            {this.header()}

            <tbody className="Invoice--body">
              {this.lines()}
            </tbody>

          </table>

          {
            editMode?
            <div className="Invoice--add" onClick={addLine}>
                <div>{plusIcon('1x')}</div>
                <p style={{fontWeight: 'bold'}}>ADD ITEM</p>
            </div>
            :
            null
          }

        </div>
      </div>
    )
  }
}
