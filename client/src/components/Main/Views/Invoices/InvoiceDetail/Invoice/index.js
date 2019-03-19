import React, { Component } from 'react'
import { line } from '../../../../../Helpers/invoiceLineHelpers'
import './index.css'

export default class Invoice extends Component {

  lines = () => {
    const { invoice } = this.props

    if (invoice && invoice.lines) {
      const lines = [...invoice.lines]
      return lines.reverse().map(data => line(data))
    }
  }

  render(){
    return (
      <div className="Invoice">
        <table>
          <thead>
            <tr>
              <td>Item</td>
              <td>Content</td>
              <td>Inc</td>
              <td>Price</td>
            </tr>
          </thead>
          <tbody>
            {this.lines()}
          </tbody>
        </table>
      </div>
    )
  }
}
