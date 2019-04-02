import React, { Component, Fragment } from 'react'
import SearchField from '../../../../../SearchField'
import { clientName } from '../../../../../Helpers/clientHelpers'

export default class Edit extends Component {

  type = (value) => {
    return (
      <Fragment>
        <label>Type</label>
        <select style={{height: '100%', fontSize: '18px'}}>
          <option>Proposal</option>
          <option>Production Invoice</option>
          <option>On Premise Contract</option>
          <option>Rental Contract</option>
          <option>Sale</option>
        </select>
      </Fragment>
    )
  }

  client = (value, searchResults) => {
    return (
      <Fragment>
        <label>Client</label>
        <SearchField
          searchResults={searchResults}
          formClassName='Edit--field'
          resultClassName='Edit--search-result'
          resultsClassName='Edit--results'
          formDataValue={this.props.formData && this.props.formData.client_id}
          formatResult={clientName}
          input={{
            className:'Input',
            placeholder:'search clients...',
            name: 'client',
            value: value,
            tabIndex: 1
          }}
          handleChange={this.props.handleSearchChange}
          onEnter={this.props.onEnter}
          onSelect={this.props.onSelect}
        />
      </Fragment>
    )
  }

  paymentStatus = (value) => {
    return (
      <Fragment>
        <label>Payment Status</label>
        <select style={{height: '100%', fontSize: '18px'}}>
          <option></option>
          <option>Not Paid</option>
          <option>Outstanding Balance</option>
          <option>Paid In Full</option>
          <option>Partially Refunded</option>
          <option>Fully Refunded</option>
        </select>
      </Fragment>
    )
  }

  paymentType = (value) => {
    return (
      <Fragment>
        <label>Payment Type</label>
        <select style={{height: '100%', fontSize: '18px'}}>
          <option></option>
          <option>Cash</option>
          <option>Check</option>
          <option>Cash | Check</option>
          <option>Deducted From Commissions</option>
          <option>Check | Deducted From Commissions</option>
        </select>
      </Fragment>
    )
  }

  checkInfo = (value) => {
    return (
      <Fragment>
        <label>Check</label>
        <input
          type="text"
          name="check"
          value={value}
        />
      </Fragment>
    )
  }

  commission = (value, paid) => {
    return (
      <Fragment>
        <label>Commission</label>
        <input
          type='number'
          name="commissionValue"
          value={value}
        />
        <select>
          <option>Not Paid</option>
          <option>Paid</option>
        </select>
      </Fragment>
    )
  }

  render(){
    const { fields, clientSearchResults } = this.props
    if (fields) {

      return (
        <div className="SubHeader">

          <div className="SubHeader--fields">
            {this.type(fields.kind)}
            {this.client(fields.client, clientSearchResults)}
          </div>

          <div className="SubHeader--status">
          {this.paymentStatus(fields.paymentStatus)}
          {this.paymentType(fields.paymentType)}
          {this.checkInfo(fields.check)}
          {
            fields.type === 'On Premise Contract'?
            this.commission(fields.commission, fields.commissionPaid)
            :
            null
          }
          </div>

        </div>
      )
    } else return null
  }
}
