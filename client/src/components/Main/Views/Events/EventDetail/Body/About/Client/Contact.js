import React, { Fragment } from 'react'
import SearchField from '../../../../../../../SearchField'

export default function Contact(props){
  const {
    type,
    fields,
    searchResults,
    formData: { contact, contact: { email_addresses_attributes } },
    handleChange,
    handleSearchFieldChange,
    onSearchFieldSelect
  } = props

  const alignLeft = { textAlign: 'left' }
  return (
    <div className="CreateClient--content">

      <label>First Name</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          name="first_name"
          value={contact.first_name? contact.first_name : ''}
          onChange={(e) => handleChange(e, 'contact')}
        />
      </div>

      <label>Last Name</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          name="last_name"
          value={contact.last_name? contact.last_name : ''}
          onChange={(e) => handleChange(e, 'contact')}
        />
      </div>

      {
        type !== 'company'?
        <Fragment>
          <label>Company</label>
          <SearchField
            searchResults={searchResults.companies.data}
            formClassName='Edit--Field'
            resultsClassName='Edit--results'
            resultClassName='Edit--result'
            formDataValue={props.formData && props.formData.company_id}
            formatResult={(company) => company.name}
            input={{
              className:'Input',
              name: 'company',
              value: fields.company? fields.company : ''
            }}
            handleChange={(name, value) => handleSearchFieldChange({target: { name, value }}, 'company')}
            onEnter={onSearchFieldSelect}
            onSelect={onSearchFieldSelect}
            create={props.createCompany}
          />
        </Fragment>
        :
        null
      }

      <label>Phone</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          type="tel"
          pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
          name="phone_number"
          value={contact.phone_number? contact.phone_number : ''}
          onChange={e => handleChange(e, 'contact')}
        />
      </div>

      <label>Email</label>
      <SearchField
        searchResults={searchResults.emailAddresses.data}
        formClassName='Edit--Field'
        resultsClassName='Edit--results'
        resultClassName='Edit--result'
        formDataValue={email_addresses_attributes && email_addresses_attributes.length}
        formatResult={email => email.emailAddress}
        input={{
          className:'Input',
          name: 'contactEmail',
          value: fields.contactEmail? fields.contactEmail : ''
        }}
        handleChange={(name, value) => handleSearchFieldChange({target: { name, value }}, 'contactEmail')}
        onEnter={onSearchFieldSelect}
        onSelect={onSearchFieldSelect}
        create={() => props.createEmailAddress('contactEmail')}
      />
    </div>
  )
}
