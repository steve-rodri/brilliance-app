import React, { Component, Fragment } from 'react'
import Location from './Location'
import Address from './Address'
import { address } from '../../../../../../../../services/BEP_APIcalls'
import { parseAddress } from '../../../../../../../../helpers/addressHelpers'
import axios from 'axios'
import './index.css'

export default class CreateLocation extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: '',
      formData: {
        place: {
          name: this.props.fields.location
        },
        address: {}
      },
      fields: {
        address: ''
      }
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    }
  }

  setView = v => this.setState({ view: v })

  handleSubmit = async() => {
    const { formData: { place: placeData } } = this.state
    const { createLocation, close } = this.props
    if (Object.keys(placeData).length) await createLocation(placeData)
    close()
  }

  handleCreate = async() => {
    const { formData: { address: addressData }} = this.state
    if( Object.keys(addressData).length ) {
      const newAddress = await address.create(addressData, this.ajaxOptions)
      this.setState(prevState => ({
        view: '',
        fields: {
          ...prevState.fields,
          address: newAddress.address
        },
        formData: {
          ...prevState.formData,
          address: {},
          place: {
            ...prevState.formData.place,
            address_id: newAddress.id
          }

        }
      }))
    }
  }

  handleChange = (e, type) => {
    const { name, value } = e.target
    this.setState(prevState => {
      if (!value) {
        delete prevState.formData[type][name]
        return prevState
      }
      return {
        formData: {
          ...prevState.formData,
          [type]: {
            ...prevState.formData[type],
            [name]: value
          }
        }
      }
    })
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

  handleSubmit = async() => {
    const { formData: { place: placeData }} = this.state;
    const { createLocation, close } = this.props
    if (Object.keys(placeData).length) await createLocation(placeData)
    close()
  }

  findAddresses = async(q) => {
    const query = q.split('')
    if (query.length > 1) {
      const data = await address.batch({q}, this.ajaxOptions)
      if (data) {
        this.setState(prevState => ({
          searchFieldData: {
            ...prevState.searchFieldData,
            addresses: data.addresses
          }
        }))
      }
    }
  }

  formatAddress = (address) => {
    return address.address
  }

  createAddress = () => this.setState(prevState => {
    let addressObj = parseAddress(prevState.fields.address)
    return {
      view: 'createAddress',
      fields: {
        ...prevState.fields,
        address: ''
      },
      formData: {
        ...prevState.formData,
        address: {
          ...prevState.formData.address,
          ...addressObj
        }
      }
    }
  })

  content = () => {
    const { view } = this.state
    switch (view) {

      case 'createAddress':
      return (
        <Address
          {...this.state}
          onChange={this.handleChange}
          onSearchFieldChange={this.handleSearchFieldChange}
          onSelect={this.handleSelect}
          formatAddress={this.formatAddress}
        />
      )

      default:
      return (
        <Location
          {...this.state}
          onChange={this.handleChange}
          onSearchFieldChange={this.handleSearchFieldChange}
          onSelect={this.handleSelect}
          formatAddress={this.formatAddress}
          createAddress={this.createAddress}
        />
      )

    }
  }

  footer = () => {
    const {
      view,
      formData: {
        place: placeData,
        address: addressData,
      }
    } = this.state

    const formData = (
      Object.keys(placeData).length ||
      Object.keys(addressData).length
    )

    if (view === 'createAddress') {
      return (
        <Fragment>
          {
            addressData?
            <Fragment>
              <button className="CreateClient--button" onClick={() => this.setView('')}>
                <p>Cancel</p>
              </button>
              <button className="CreateClient--button" onClick={this.handleCreate}>
                <p>Create Address</p>
              </button>
            </Fragment>
            :
            <button className="CreateClient--button" onClick={() => this.setView('')}>
              <p>Cancel</p>
            </button>
          }
        </Fragment>
      )
    }

    if (formData) {
      return (
        <button className="CreateClient--button" onClick={this.handleSubmit}>
          <p>CREATE</p>
        </button>
      )
    }

    return null
  }

  render(){
    const { mobile } = this.props
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
          {this.footer()}
        </div>
      </div>
    )
  }
}
