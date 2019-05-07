import React, { Component } from 'react'
import Line from './Line/index.js'
import { plusIcon } from '../../../../../../helpers/icons'
import './index.css'

export default class Invoice extends Component {

  styleCell = (index, length, type) => {
    const style = {}

    switch (type) {
      case 'delete':
        style.color = 'var(--light-gray)'
        break;
      case 'quantity':
        style.padding = 0
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
      return lines.reverse().map( (line, id) =>
        <Line
          {...this.props}
          key={line.id}
          index={id}
          length={lines.length}
          line={line}
          styleCell={this.styleCell}
        />
      )
    }
  }

  header = () => {
    const { inv, editMode } = this.props
    if (inv) {
      if (editMode || (inv.lines && inv.lines.length)) {
        return (
          <thead className="Invoice--header">
            <tr className= "Invoice--header-row">
              {editMode? <th className="Invoice--header-cell Invoice--header-edit"></th> : null}
              <th className="Invoice--header-cell Invoice--header-quantity"><h3>Quantity</h3></th>
              <th className="Invoice--header-cell Invoice--header-item"><h3>Item</h3></th>
              {editMode? <th className="Invoice--header-cell Invoice--header-inc"><h3>Inc</h3></th> : null}
              <th className="Invoice--header-cell Invoice--header-price"><h3>Price</h3></th>
            </tr>
          </thead>
        )
      } else {
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
                <div>{plusIcon('2x')}</div>
                <h3 style={{fontWeight: 'bold'}}>New Line</h3>
            </div>
            :
            null
          }

        </div>
      </div>
    )
  }
}
