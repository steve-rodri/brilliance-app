import React, { Component } from 'react'
import numeral from 'numeral'
import './index.css'

export default class Summary extends Component {
  render(){
    const { editMode, inv } = this.props

    if (inv) {

      if (editMode) {
        return (
          <div className="Summary">
            <div className="Summary--totals">
              <div>
                <h3>SubTotal:</h3>
                <p>{numeral(inv.subTotal).format('$0,0.00')}</p>
              </div>
              <div>
                <h3>Discount:</h3>
                <p>{numeral(inv.discount).format('$0,0.00')}</p>
              </div>
              <div>
                <h3>Total:</h3>
                <p>{numeral(inv.total).format('$0,0.00')}</p>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="Summary">
            <div className="Summary--totals">
              <div>
                <h3>Total:</h3>
                <p>{numeral(inv.total).format('$0,0.00')}</p>
              </div>
              {<div>
                <h3>Deposit:</h3>
                <p>{numeral(inv.deposit).format('$0,0.00')}</p>
              </div>}
              <div>
                <h3>Balance:</h3>
                <p>{numeral(inv.balance).format('$0,0.00')}</p>
              </div>
            </div>
          </div>
        )
      }
    } else { return null }
  }
}
