import React, { Component } from 'react'
import Location from './Location'
import { address } from '../../../../../../../../services/BEP_APIcalls'
import axios from 'axios'
import './index.css'

export default class CreateLocation extends Component {
  constructor(props){
    super(props)
    this.state = {
      search: this.props.fields.location,
      formData: {
        place: {},
        address: {}
      }
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    }
  }

  handleSubmit = async() => {
    const { formData } = this.state
    const { createLocation, close } = this.props
    if (Object.keys(formData).length) await createLocation(formData)
    close()
  }

  handleChange = (e, type) => {
    const { name, value } = e.target
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [type]: {
          ...prevState.formData.type,
          [name]: value
        }
      }
    }))
  }

  handleSearchFieldChange = (e, type) => {
    const { name, value } = e.target
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    }))

    switch (type) {
      case 'address':
        this.findAddresses(value)
      break;
      default:
      break;
    }
  }

  handleSelect = (e, type, index) => {
    const { searchFieldData: { addresses }} = this.state
    switch (type) {
      case 'address':
        this.setState(prevState => ({
          formData: {
            ...prevState.formData,
            place: {
              ...prevState.formData.place,
              address_id: addresses[index].id
            }
          },
          fields: {
            ...prevState.fields,
            address: addresses[index].address
          }
        }))
        break;
      default:

    }
  }

  findAddresses = async(q) => {
    const query = q.split('')
    if (query.length > 1) {
      const data = await address.batch({q}, this.ajaxOptions)
      this.setState(prevState => ({
        searchFieldData: {
          ...prevState.searchFieldData,
          addresses: data.addresses
        }
      }))
    }
  }

  formatAddress = (address) => {
    return address.address
  }

  content = () => {
    return (
      <Location
        {...this.props}
        {...this.state}
        onChange={this.handleChange}
        onSearchFieldChange={this.handleSearchFieldChange}
        onSelect={this.handleSelect}
        formatAddress={this.formatAddress}
      />
    )
  }

  render(){
    const { mobile } = this.props
    const noFormData = !Object.keys(this.state.formData).length
    return(
      <div className="CreateLocation">
        <div className="CreateLocation--header">

          {
            mobile?
            <button
              className="CreateLocation--back-button"
              onClick={this.props.close}
            >
              Back
            </button>
            :
            null
          }

          <h2>Create Location</h2>
        </div>
        <div className="CreateLocation--content">
          {this.content()}
        </div>
        <div className="CreateLocation--footer">
          {
            noFormData?
            <button className="CreateLocation--button" onClick={this.props.close}>
              <p>Cancel</p>
            </button>
            :
            <button className="CreateLocation--button" onClick={this.handleSubmit}>
              <p>CREATE</p>
            </button>
          }
        </div>
      </div>
    )
  }
}
