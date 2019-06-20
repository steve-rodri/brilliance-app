import React from 'react'
import SearchField from '../../../../../../../SearchField'

export default function Edit(props){
  const {
    fields,
    searchResults,
    handleSearchFieldChange,
    onSearchFieldSelect
  } = props

  return (
    <div>
      <label>Contact</label>
      <SearchField
        searchResults={searchResults.contacts.data}
        formClassName='Edit--Field'
        resultsClassName='Edit--results'
        resultClassName='Edit--result'
        formDataValue={props.formData && props.formData.contact_id}
        formatResult={(contact) => contact.fullName}
        input={{
          className:'Input',
          name: 'contact',
          value: fields.contact? fields.contact : ''
        }}
        handleChange={(name, value) => handleSearchFieldChange({target: { name, value }}, 'contact')}
        onEnter={onSearchFieldSelect}
        onSelect={onSearchFieldSelect}
        create={props.createContact}
      />

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
    </div>
  )
}
