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
                  <h2>{numeral(inv.subTotal).format('$0,0.00')}</h2>
                </div>
                <div>
                  <label>Discount</label>
                  <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                    <h2>$</h2>
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
                  <h2>{numeral(inv.total).format('$0,0.00')}</h2>
                </div>
                {
                  inv.kind !== 'Proposal'?
                  <Fragment>
                    <div>
                      <label>Deposit</label>
                      <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                        <h2>$</h2>
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
                      <h2>{numeral(inv.balance).format('$0,0.00')}</h2>
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
                  <h2>{numeral(inv.total).format('$0,0.00')}</h2>
                </div>
                {
                  inv.kind !== 'Proposal'?
                  <Fragment>
                    <div>
                      <label>Deposit</label>
                      <h2>{numeral(inv.deposit).format('$0,0.00')}</h2>
                    </div>
                    <div>
                      <label>Balance</label>
                      <h2>{numeral(inv.balance).format('$0,0.00')}</h2>
                    </div>
                  </Fragment>
                  :
                  null
                }
              </div>
            </div>
          </div>
        )
      }
    } else { return null }
  }
}
