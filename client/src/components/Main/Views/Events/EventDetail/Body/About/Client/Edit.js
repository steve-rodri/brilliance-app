import React from 'react'
import Contact from './Contact'
import Company from './Company'
import ChooseContact from './ChooseContact'
import ChooseCompany from './ChooseCompany'
import SearchField from '../../../../../../../SearchField'

export default function Edit(props){
  const {
    type,
    view,
    fields,
    searchResults: { contacts, companies },
    handleSearchFieldChange,
    onSearchFieldSelect
  } = props

  switch (type) {

    case 'contact':
      switch (view) {

        case 'chooseExisting':
        return <ChooseContact {...props} contacts={contacts}/>

        case 'form':
        return <Contact {...props} />

        case 'createContact':
        return <Contact {...props} />

        case 'createCompany':
        return <Company {...props}/>

        default:
        break;
      }
    break;

    case 'company':
      switch (view) {

        case 'chooseExisting':
        return <ChooseCompany companies={companies}/>

        case 'form':
        return <Company {...props}/>

        case 'createCompany':
        return <Company {...props}/>

        case 'createContact':
        return <Contact {...props}/>

        default:
        break;
      }
    break;

    default:
    return (
      <div>
        <label>Contact</label>
        <SearchField
          searchResults={contacts.data}
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
          edit={props.editContact}
        />

        <label>Company</label>
        <SearchField
          searchResults={companies.data}
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
          edit={props.editCompany}
        />
      </div>
    )
  }

}
