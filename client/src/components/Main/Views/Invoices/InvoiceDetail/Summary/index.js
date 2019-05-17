import React, { Component, Fragment } from 'react'
import numeral from 'numeral'
import './index.css'

export default class Summary extends Component {
  render(){
    const { editMode, inv, fields, handleChange } = this.props

    if (inv) {

      if (editMode) {
        return (
          <div className="Summary--container">
            <div className="Summary">
              <div className="Summary--totals">
                <div>
                  <label>SubTotal</label>
                  <p>{numeral(inv.subTotal).format('$0,0.00')}</p>
                </div>
                <div>
                  <label>Discount</label>
                  <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                    <p>$</p>
                    <input
                      className="Summary--input"
                      type="number"
                      name="discount"
                      value={fields && fields.discount? fields.discount : ''}
                      onChange={(e) => handleChange(e)}
                      onFocus={this.props.handleFocusSelect}
                    />
                  </form>
                </div>
                <div>
                  <label>Total</label>
                  <p>{numeral(inv.total).format('$0,0.00')}</p>
                </div>
                {
                  inv.kind !== 'Proposal'?
                  <Fragment>
                    <div>
                      <label>Deposit</label>
                      <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                        <p>$</p>
                        <input
                          className="Summary--input"
                          type="number"
                          name="deposit"
                          value={fields && fields.deposit? fields.deposit : ''}
                          onChange={(e) => handleChange(e)}
                          onFocus={this.props.handleFocusSelect}
                        />
                      </form>
                    </div>
                    <div>
                      <label>Balance</label>
                      <p>{numeral(inv.balance).format('$0,0.00')}</p>
                    </div>
                  </Fragment>
                  :
                  null
                }
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
                  <label>Total</label>
                  <p>{numeral(inv.total).format('$0,0.00')}</p>
                </div>
                <div>
                  <label>Deposit</label>
                  <p>{numeral(inv.deposit).format('$0,0.00')}</p>
                </div>
                <div>
                  <label>Balance</label>
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
