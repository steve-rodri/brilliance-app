import React, { Component } from 'react'
import numeral from 'numeral'
import './index.css'

export default class Summary extends Component {
  render(){
    const { editMode, inv } = this.props

    if (inv) {

      if (editMode) {
        return (
          <div className="Summary--container">
            <div className="Summary">
              <div className="Summary--totals">
                <div>
                  <label>SubTotal :</label>
                  <p>{numeral(inv.subTotal).format('$0,0.00')}</p>
                </div>
                <div>
                  <label>Discount :</label>
                  <p>{numeral(inv.discount).format('$0,0.00')}</p>
                </div>
                <div>
                  <label>Total :</label>
                  <p>{numeral(inv.total).format('$0,0.00')}</p>
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="Summary--container">
            <div className="Summary">
              <div className="Summary--totals">
                <div>
                  <label>Total :</label>
                  <p>{numeral(inv.total).format('$0,0.00')}</p>
                </div>
                <div>
                  <label>Deposit :</label>
                  <p>{numeral(inv.deposit).format('$0,0.00')}</p>
                </div>
                <div>
                  <label>Balance :</label>
                  <p>{numeral(inv.balance).format('$0,0.00')}</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    } else { return null }
  }
}
