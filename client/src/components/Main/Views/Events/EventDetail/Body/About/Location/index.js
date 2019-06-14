import React, { Component, Fragment } from 'react'
import LocationForm from './LocationForm'
import Address from './Address'
import { place, address } from '../../../../../../../../services/BEP_APIcalls'
import { parseAddress } from '../../../../../../../../helpers/addressHelpers'
import axios from 'axios'
import './index.css'

export default class Location extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: '',
      mode: '',
      formData: {
        place: {},
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

  async componentDidMount(){
    await this.runSetup()
  }

  runSetup = async() => {
    const { showLocationModal, showCallLocationModal, formData, fields } = this.props
    let location, addressObj = {};

    if (showLocationModal && formData.location_id) {
      location = await place.get(formData.location_id, this.ajaxOptions)
      addressObj = location && location.address? location.address : {};
    }

    if (showCallLocationModal && formData.call_location_id) {
      location = await place.get(formData.call_location_id, this.ajaxOptions)
      addressObj = location && location.address? location.address : {};
    }

    const { address, ...rest } = addressObj

    this.setState( prevState => {

      if (location) return {
        mode: 'edit',
        formData: {
          ...prevState.formData,
          place: {
            id: location.id,
            name: location.name,
            short_name: location.shortName,
            address_id: addressObj.id
          },
          address: rest
        },
        fields: {
          address: addressObj.address? addressObj.address : ''
        }
      }

      if (showLocationModal) return {
        mode: 'create',
        formData: {
          ...prevState.formData,
          place: {
            name: fields.location
          }
        }
      }

      if (showCallLocationModal) return {
        mode: 'create',
        formData: {
          ...prevState.formData,
          place: {
            name: fields.callLocation
          }
        }
      }

    })
  }

  setView = v => this.setState({ view: v })

  handleSubmit = async() => {
    const { formData: { place: placeData } } = this.state
    const { onLocationSubmit, close } = this.props
    if (Object.keys(placeData).length) await onLocationSubmit(placeData)
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

  handleUpdate = async() => {
    const { formData: { address: addressData }} = this.state
    if( Object.keys(addressData).length ) {
      const updatedAddress = await address.update(addressData.id, addressData, this.ajaxOptions)
      if (updatedAddress) {
        this.setState(prevState => ({
          view: '',
          fields: {
            ...prevState.fields,
            address: updatedAddress.address
          }
        }))
      }
    }
  }

  handleChange = (e, type) => {
    const { name, value } = e.target
    this.setState(prevState => {
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
    const { onLocationSubmit, close } = this.props
    if (Object.keys(placeData).length) await onLocationSubmit(placeData)
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

  openAddress = () => this.setState(prevState => {
    const { mode } = this.state;
    let addressObj;
    if (mode === 'create') {
      addressObj = parseAddress(prevState.fields.address)
      return {
        view: 'addressForm',
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
    }
    if (mode === 'edit') return { view: 'addressForm' }
  })

  content = () => {
    const { view } = this.state
    switch (view) {

      case 'addressForm':
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
        <LocationForm
          {...this.state}
          onChange={this.handleChange}
          onSearchFieldChange={this.handleSearchFieldChange}
          onSelect={this.handleSelect}
          formatAddress={this.formatAddress}
          openAddress={this.openAddress}
        />
      )

    }
  }

  footer = () => {
    const { view, mode, formData: { address: addressData } } = this.state

    if (view === 'addressForm') {
      if (mode === 'create') {
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
      if (mode === 'edit') {
        return (
          <Fragment>
            {
              addressData?
              <Fragment>
                <button className="CreateClient--button" onClick={() => this.setView('')}>
                  <p>Cancel</p>
                </button>
                <button className="CreateClient--button" onClick={this.handleUpdate}>
                  <p>Update Address</p>
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
    }

    return (
      <button className="CreateClient--button" onClick={this.handleSubmit}>
        <p>SUBMIT</p>
      </button>
    )
  }

  render(){
    const { mobile } = this.props
    const { mode, view } = this.state
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

          <h2>{`${mode === 'create'? 'Create' : 'Edit'} ${view === 'addressForm'? 'Address' : 'Location'}`}</h2>
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
