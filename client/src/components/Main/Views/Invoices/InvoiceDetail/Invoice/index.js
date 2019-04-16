import React, { Component } from 'react'
import Line from './Line/index.js'
import { addIcon } from '../../../../../Helpers/icons'
import './index.css'

export default class Invoice extends Component {
  lines = () => {
    const { inv } = this.props
    if (inv && inv.lines) {
      const lines = [...inv.lines]
      return lines.reverse().map(line =>
        <Line
          {...this.props}
          key={line.id}
          line={line}
        />
      )
    }
  }

  render(){
    const { editMode, addLine } = this.props
    return (
      <div className="Invoice--container">
        <div className="Invoice">

          <table>

            <thead className="Invoice--header">
              <tr className= "Invoice--header-row">
                {editMode? <th className="Invoice--header-cell Invoice--header-edit"></th> : null}
                <th className="Invoice--header-cell Invoice--header-quantity"><p>Quantity</p></th>
                <th className="Invoice--header-cell Invoice--header-item"><p>Item</p></th>
                {editMode? <th className="Invoice--header-cell Invoice--header-inc"><p>Inc</p></th> : null}
                <th className="Invoice--header-cell Invoice--header-price"><p>Price</p></th>
              </tr>
            </thead>

            <tbody className="Invoice--body">
              {this.lines()}

              {
                editMode?
                <tr className="Line">
                  <td className="Invoice--cell Line--add-delete" onClick={addLine}>{addIcon('1x')}</td>
                  <td className="Invoice--cell Line--quantity"></td>
                  <td className="Invoice--cell Line--item"></td>
                  <td className="Invoice--cell Line--inc"></td>
                  <td className="Invoice--cell Line--price"></td>
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
