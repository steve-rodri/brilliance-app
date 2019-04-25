import React, { Component, Fragment } from 'react'
import SearchField from '../../../../../SearchField'
import { clientName } from '../../../../../../helpers/clientHelpers'

export default class Edit extends Component {

  handleFocusSelect = (e) => {
    e.target.select()
  }

  type = (value, change) => {
    return (
      <Fragment>
        <label>Type</label>
        <select
          className="Edit--Field"
          name="kind"
          value={value}
          onChange={change}
        >
          <option>Proposal</option>
          <option>Production Invoice</option>
          <option>On Premise Contract</option>
          <option>Rental Contract</option>
          <option>Sale</option>
        </select>
      </Fragment>
    )
  }

  client = (value, searchFieldData) => {
    const { handleClientChange, onSelect, onEnter, formData } = this.props
    return (
      <Fragment>
        <label>Client</label>
          <SearchField
            searchResults={searchFieldData && searchFieldData.clients}
            formClassName='Edit--Field'
            resultClassName='Edit--search-result'
            resultsClassName='Edit--results'
            formDataValue={formData && formData.client_id}
            formatResult={clientName}
            input={{
              className:'Input',
              placeholder:'search clients...',
              name: 'client',
              value: value,
              tabIndex: 1
            }}
            handleChange={handleClientChange}
            onFocus={this.handleFocusSelect}
            onEnter={onEnter}
            onSelect={onSelect}
          />
      </Fragment>
    )
  }

  paymentStatus = (value, change) => {
    return (
      <Fragment>
        <label>Payment Status</label>
        <select
          className="Edit--Field"
          name="paymentStatus"
          value={value}
          onChange={change}
        >
          <option>Not Paid</option>
          <option>Outstanding Balance</option>
          <option>Paid In Full</option>
          <option>Partially Refunded</option>
          <option>Fully Refunded</option>
        </select>
      </Fragment>
    )
  }

  paymentType = (value, change) => {
    return (
      <Fragment>
        <label>Payment Type</label>
        <select
          className="Edit--Field"
          name="paymentType"
          value={value}
          onChange={change}
        >
          <option>-</option>
          <option>Cash</option>
          <option>Check</option>
          <option>Cash & Check</option>
          <option>Deducted From Commissions</option>
          <option>Check & DFC</option>
        </select>
      </Fragment>
    )
  }

  checkInfo = (value, change) => {
    return (
      <Fragment>
        <label style={{gridRow: '3 / span 1'}}>Check Information</label>
        <input
          style={{textAlign: 'center', gridRow: '4 / span 1'}}
          className="Edit--Field"
          type="text"
          name="check"
          value={value || ''}
          onChange={change}
          onFocus={this.handleFocusSelect}
        />
      </Fragment>
    )
  }

  commission = (value, paid, change) => {
    return (
      <Fragment>
        <label>Amount</label>
        <input
          className="Edit--Field"
          type='number'
          name="commissionValue"
          value={value}
          onChange={change}
        />
        <label>Status</label>
        <select
          className="Edit--Field"
          name="commissionPaid"
          value={paid}
          onChange={change}
        >
          <option>Not Paid</option>
          <option>Paid</option>
        </select>
      </Fragment>
    )
  }

  status = (fields, change) => {
    if (fields.kind !== 'Proposal') {
      return (
        <Fragment>
          {this.paymentStatus(fields.paymentStatus, change)}
          {this.paymentType(fields.paymentType, change)}
          {
            fields.paymentType && fields.paymentType.includes('Check')?
            this.checkInfo(fields.check, change)
            :
            null
          }
        </Fragment>
      )
    } else {
      return null
    }
  }

  render(){
    const { fields, handleChange, searchFieldData } = this.props
    if (fields) {
      return (
        <div className="SubHeader">

          <div className="SubHeader--Edit SubHeader--fields-container">
            <div className="SubHeader-Edit SubHeader--component-title"><h3>About</h3></div>
            <div className="SubHeader--Edit SubHeader--fields">
              {fields.kind? this.type(fields.kind, handleChange) : null}
              {fields.client? this.client(fields.client, searchFieldData) : null}
            </div>
          </div>

          {
            fields && fields.kind !== 'Proposal'?
            <div className="SubHeader--Edit SubHeader--status-container">
              <div className="SubHeader-Edit SubHeader--component-title"><h3>Status</h3></div>
              <div className="SubHeader--Edit SubHeader--status">
                {this.status(fields, handleChange)}
              </div>
            </div>
            :
            null
          }

          {
            fields && fields.kind === 'On Premise Contract'?
            <div className="SubHeader--Edit SubHeader--commission-container">
              <div className="SubHeader-Edit SubHeader--component-title"><h3>Commission</h3></div>
              <div className="SubHeader--Edit SubHeader--commission">
                {this.commission(fields.commission, fields.commissionPaid, handleChange)}
              </div>
            </div>
            :
            null
          }

        </div>
      )
    } else return null
  }
}
