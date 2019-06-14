import React, { Fragment } from 'react'
import SearchField from '../../../../../../../SearchField'

export default function LocationForm(props) {
  const { formData: { place }, searchFieldData, fields, onChange, onSearchFieldChange, onSelect } = props
  const alignLeft = { textAlign: 'left' }
  return (
    <Fragment>

      <label>Name</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          name="name"
          value={place.name? place.name : ''}
          onChange={(e) => onChange(e, 'place')}
        />
      </div>

      <label>Short Name</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          name="short_name"
          value={place.short_name? place.short_name : ''}
          onChange={(e) => onChange(e, 'place')}
        />
      </div>

      <label>Address</label>
        <SearchField
          formClassName='Edit--Field'
          resultsClassName='Edit--results'
          resultClassName='Edit--result'
          formDataValue={place && place.address_id}
          formatResult={props.formatAddress}
          label='Address'
          input={{
            className: 'Input',
            name: 'address',
            value: fields.address? fields.address : ''
          }}
          searchResults={searchFieldData && searchFieldData.addresses}
          handleChange={(name, value) => onSearchFieldChange({target: { name, value }}, 'address')}
          onEnter={onSelect}
          onSelect={onSelect}
          create={props.openAddress}
          edit={props.openAddress}
        />

    </Fragment>
  )
}
