import React, { Component } from 'react'
import Line from './Line/index.js'
import { addIcon } from '../../../../../../helpers/icons'
import './index.css'

export default class Invoice extends Component {

  styleCell = (index, length) => {
    if ( length - (index + 1) === 0) {
      return (
        {
          borderBottom: 'none',
          borderTop: 'none'
        }
      )
    } else if (index + 1 === length) {
      return (
        {
          borderBottom: 'none'
        }
      )
    } else if (index === 0) {
      return (
        {
          borderTop: 'none'
        }
      )
    }
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
              <th className="Invoice--header-cell Invoice--header-quantity"><p>Quantity</p></th>
              <th className="Invoice--header-cell Invoice--header-item"><p>Item</p></th>
              {editMode? <th className="Invoice--header-cell Invoice--header-inc"><p>Inc</p></th> : null}
              <th className="Invoice--header-cell Invoice--header-price"><p>Price</p></th>
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
    const { inv, editMode, addLine } = this.props
    let index = 0;
    let length = 0;
    if (inv && inv.lines) {
      index = inv.lines.length
      length = inv.lines.length + 1
    }
    return (
      <div className="Invoice--container">
        <div className="Invoice">

          <table>

            {this.header()}

            <tbody className="Invoice--body">
              {this.lines()}

              {
                editMode?
                <tr className="Line">
                  <td style={this.styleCell(index, length)} className="Invoice--cell Line--add-delete" onClick={addLine}>{addIcon('1x')}</td>
                  <td style={this.styleCell(index, length)} className="Invoice--cell Line--quantity"></td>
                  <td style={this.styleCell(index, length)} className="Invoice--cell Line--item"></td>
                  <td style={this.styleCell(index, length)} className="Invoice--cell Line--inc"></td>
                  <td style={this.styleCell(index, length)} className="Invoice--cell Line--price"></td>
                </tr>
                :
                null
              }

            </tbody>

          </table>

        </div>
      </div>
    )
  }
}
