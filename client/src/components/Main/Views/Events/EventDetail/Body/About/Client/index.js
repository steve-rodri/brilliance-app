import React, { Component, Fragment } from 'react'
import Edit from './Edit'
import Create from './Create'
import { client, contact, company, emailAddress } from '../../../../../../../../services/BEP_APIcalls.js'
import axios from 'axios'
import './index.css'

export default class Client extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: '',
      mode: 'edit',
      search: this.props.fields.client,
      searchResults: {
        contacts: {},
        companies: {},
        emailAddresses: {}
      },
      formData: {
        contact: {
          email_addresses_attributes: []
        },
        company: {
          email_addresses_attributes: []
        },
      },
      fields: {}
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    }
  }

  componentWillUnmount(){
    this.axiosRequestSource = this.axiosRequestSource.cancel()
  }

  async componentDidMount(){
    await this.runSetup()
  }

  runSetup = async() => {
    const { formData } = this.props
    let clt;
    if (formData.client_id) clt = await client.get(formData.client_id, this.ajaxOptions)
    if (!clt) await this.searchForExisting()

    this.setState( prevState => {

      if (!clt) return { mode: 'create' }

      let newState = {
        mode: 'edit',
        formData: {
          ...prevState.formData,
          id: clt.id
        },
        fields: {
          contact: clt.contactInfo? clt.contactInfo.fullName : '',
          company: clt.company? clt.company.name : '',
        }
      }

      if (clt.contactInfo) {
        newState.formData = {
          ...newState.formData,
          contact_id: clt.contactInfo.id,
          contact: {
            ...newState.formData.contact,
            id: clt.contactInfo.id,
            first_name: clt.contactInfo.firstName || '',
            last_name: clt.contactInfo.lastName || '',
            phone_number: clt.contactInfo.phone_number || ''
          }
        }
        const emailAddresses = clt.contactInfo.emailAddresses
        if (emailAddresses && emailAddresses.length) {
          newState.formData.contact.email_addresses_attributes = emailAddresses
        }
      }

      if (clt.company) {
        newState.formData = {
          ...newState.formData,
          company_id: clt.company.id,
          company: {
            ...newState.formData.company,
            id: clt.company.id,
            name: clt.company.firstName || '',
            phone_number: clt.company.phone_number || ''
          }
        }

        const emailAddresses = clt.company.emailAddresses
        if (emailAddresses && emailAddresses.length) {
          newState.formData.company.email_addresses_attributes = emailAddresses
        }
      }

      return newState
    })
  }

  searchForExisting = async() => {
    const { fields } = this.props
    await this.findContacts(fields && fields.client)
    await this.findCompanies(fields && fields.client)
  }

  findContacts = async(query) => {
    const q = query.split('');
    if (q.length > 1) {
      const data = await contact.find({q: query}, this.ajaxOptions)
      if (!data) return;
      this.setState(prevState => ({
        searchResults: {
          ...prevState.searchResults,
          contacts: {
            ...prevState.searchResults.contacts,
            count: data.meta.count,
            data: data.contacts
          }
        }
      }))
      return data.contacts
    }
  }

  findCompanies = async(query) => {
    const q = query.split('')
    if (q.length > 1 ) {
      const data = await company.find({q: query}, this.ajaxOptions)
      this.setState(prevState => ({
        searchResults: {
          ...prevState.searchResults,
          companies: {
            ...prevState.searchResults.companies,
            count: data.meta.count,
            data: data.companies
          }
        }
      }))
      return data.companies
    }
  }

  findEmailAddresses = async(query) => {
    const q = query.split('')
    if (q.length > 1 ) {
      const data = await emailAddress.find({q: query}, this.ajaxOptions)
      this.setState(prevState => ({
        searchResults: {
          ...prevState.searchResults,
          emailAddresses: {
            ...prevState.searchResults.emailAddresses,
            count: data.meta.count,
            data: data.emailAddresses
          }
        }
      }))
      return data.emailAddresses
    }
  }

  createContact = () => {
    this.setState(prevState => {
      const words = prevState.fields.contact.split(' ')
      return {
        view: 'createContact',
        fields: {
          ...prevState.fields,
          contact: ''
        },
        formData: {
          ...prevState.formData,
          contact: {
            ...prevState.formData.contact,
            first_name: words.shift(),
            last_name: words.join(' ')
          }
        }
      }
    })
  }

  createCompany = () => {
    this.setState(prevState => ({
      view: 'createCompany',
      fields: {
        ...prevState.fields,
        company: ''
      },
      formData: {
        ...prevState.formData,
        company: {
          ...prevState.formData.company,
          name: prevState.fields.company
        }
      }
    }))
  }

  createEmailAddress = async(type) => {
    const isValidEmail = (value) => {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(value).toLowerCase());
    }
    let newEmail;
    switch (type) {
      case 'companyEmail':
        const { companyEmail } = this.state.fields
        if (isValidEmail(companyEmail)) {
          newEmail = await emailAddress.create({ email_address: { email_address: companyEmail } }, this.ajaxOptions)
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              company: {
                ...prevState.formData.company,
                email_addresses_attributes: [
                  { id: newEmail.id }
                ]
              }
            }
          }))
        }
      break;

      case 'contactEmail':
        const { contactEmail } = this.state.fields
        if (isValidEmail(contactEmail)) {
          newEmail = await emailAddress.create({ email_address: { email_address: contactEmail } }, this.ajaxOptions)
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              contact: {
                ...prevState.formData.contact,
                email_addresses_attributes: [
                  { id: newEmail.id }
                ]
              }
            }
          }))
        }
      break;

      default:
      break;
    }
  }

  editContact = () => {
    this.setState(prevState => ({
      type: 'contact',
      view: 'createContact'
    }))
  }

  editCompany = () => {
    this.setState(prevState => ({
      type: 'company',
      view: 'form'
    }))
  }

  skip = () => {
    this.setState({
      view: 'form',
      searchResults: {
        contacts: {},
        companies: {},
        emailAddresses: {}
      }
    })
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

  handleSearchFieldChange = async(e, type) => {
    const { name, value } = e.target
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    }))

    switch (type) {
      case 'company':
        await this.findCompanies(value)
      break;
      case 'contact':
        await this.findContacts(value)
      break;
      case 'companyEmail':
        await this.findEmailAddresses(value)
      break;
      case 'contactEmail':
        await this.findEmailAddresses(value)
      break;
      default:
      break;
    }
  }

  handleSubmit = async() => {
    const {
      mode,
      formData: {
        contact: {
          email_addresses_attributes: contactEmailData,
           ...contactData
         },
        company: {
          email_addresses_attributes: companyEmailData,
          ...companyData
        },
        ...data
      }
    } = this.state
    const { onClientSubmit, close } = this.props

    let newContact, newCompany;

    if (Object.keys(contactData).length || contactEmailData.length) {
      if (mode === 'create') {
        newContact = await contact.create({ ...contactData, ...contactEmailData }, this.ajaxOptions)
      }
      if (mode === 'edit') {
        newContact = await contact.update(data.contact_id, { ...contactData, ...contactEmailData }, this.ajaxOptions)
      }
      data.contact_id = newContact.id
    }

    if (Object.keys(companyData).length || companyEmailData.length) {
      if (mode === 'create') {
        newCompany = await company.create({ ...companyData, ...companyEmailData }, this.ajaxOptions)
      }

      if (mode === 'edit') {
        newCompany = await company.update(data.company_id, { ...companyData, ...companyEmailData }, this.ajaxOptions)
      }
      data.company_id = newCompany.id
    }

    if (Object.keys(data).length) await onClientSubmit(data)
    close()
  }

  handleSelect = async(id, type) => {
    const { createClient, close } = this.props
    let data = {};

    if (type === 'contact') data.contact_id = id
    if (type === 'company') data.company_id = id

    if (Object.keys(data).length) await createClient(data)
    close()
  }

  handleSearchFieldSelect = async(e, name, index) => {
    const {
      searchResults: {
        contacts: { data: contactData },
        companies: { data: companyData },
        emailAddresses: { data: emailData }
      }
    } = this.state
    switch (name) {
      case 'company':
        this.setState(prevState => ({
          formData: {
            ...prevState.formData,
            company_id: companyData[index].id
          },
          fields: {
            ...prevState.fields,
            company: companyData[index].name
          }
        }))
      break;

      case 'contact':
        this.setState(prevState => ({
          formData: {
            ...prevState.formData,
            contact_id: contactData[index].id
          },
          fields: {
            ...prevState.fields,
            contact: contactData[index].fullName
          }
        }))
      break;

      case 'email':
        this.setState(prevState => {
          const { type } = this.state
          const applyState = {
            fields: {
              ...prevState.fields,
              [name]: emailData[index].emailAddress
            }
          }

          if (type === 'contact') {
            applyState.formData = {
              ...prevState.formData,
              contact: {
                ...prevState.formData.contact,
                email_addresses_attributes: [
                  { id: emailData[index].id }
                ]
              }
            }
          }
          if (type === 'company') {
            applyState.formData = {
              ...prevState.formData,
              company: {
                ...prevState.formData.company,
                email_addresses_attributes: [
                  { id: emailData[index].id }
                ]
              }
            }
          }
          return applyState
        })
      break;

      default:
      break;
    }
  }

  handleCreateOrUpdate = async() => {
    const {
      view,
      formData: {
        contact: {
          email_addresses_attributes: contactEmailData,
           ...contactData
         },
        company: {
          email_addresses_attributes: companyEmailData,
          ...companyData
        }
      }
    } = this.state

    switch (view) {

      case 'createContact':
        if ( Object.keys(contactData).length || contactEmailData.length ) {
          let newContact;
          if (contactData.id) {
            newContact = await contact.update(contactData.id, { ...contactData, ...contactEmailData }, this.ajaxOptions)
          } else {
            newContact = await contact.create({ ...contactData, ...contactEmailData }, this.ajaxOptions)
          }
          this.setState( prevState => {
            return {
              view: 'form',
              fields: {
                ...prevState.fields,
                contact: newContact.fullName
              },
              formData: {
                ...prevState.formData,
                contact: {
                  email_addresses_attributes: []
                },
                contact_id: newContact.id
              }
            }
          })
        }
      break;

      case 'createCompany':
        if ( Object.keys(companyData).length || companyEmailData.length ) {
          let newCompany;
          if (companyData.id) {
            newCompany = await company.update(companyData.id, { ...companyData, ...companyEmailData }, this.ajaxOptions)
          } else {
            newCompany = await company.create({ ...companyData, ...companyEmailData }, this.ajaxOptions)
          }
          this.setState(prevState => {
            return {
              view: 'form',
              fields: {
                ...prevState.fields,
                company: newCompany.name
              },
              formData: {
                ...prevState.formData,
                company: {
                  email_addresses_attributes: []
                },
                company_id: newCompany.id
              }
            }
          })
        }
      break;

      default:
      break;
    }
  }

  setView = view => this.setState({ view })

  setType = type => this.setState({ type })

  setPerson = () => {
    const { search, searchResults: { contacts } } = this.state
    const contactData = contacts && contacts.data && contacts.data.length
    const terms = search.split(' ')
    this.setState(prevState => ({
      type: 'contact',
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          first_name: terms[0],
          last_name: terms[1]
        }
      }
    }), () => {
      if (contactData) this.setView('chooseExisting')
      else this.setView('form')
    })
  }

  setCompany = () => {
    const { search, searchResults: { companies } } = this.state
    const companyData = companies && companies.data && companies.data.length
    this.setState(prevState => ({
      type: 'company',
      formData: {
        ...prevState.formData,
        company: {
          ...prevState.formData.company,
          name: search
        }
      }
    }), () => {
      if (companyData) this.setView('chooseExisting')
      else this.setView('form')
    })
  }

  content = () => {
    switch (this.state.mode) {
      case 'edit':
      return (
        <Edit
          {...this.props}
          {...this.state}
          handleSearchFieldChange={this.handleSearchFieldChange}
          onSearchFieldSelect={this.handleSearchFieldSelect}
          editContact={this.editContact}
          editCompany={this.editCompany}
        />
      )

      case 'create':
      return (
        <Create
          {...this.props}
          {...this.state}
          handleChange={this.handleChange}
          handleSelect={this.handleSelect}
          handleSearchFieldChange={this.handleSearchFieldChange}
          onSearchFieldSelect={this.handleSearchFieldSelect}
          createCompany={this.createCompany}
          createContact={this.createContact}
          createEmailAddress={this.createEmailAddress}
          skip={this.skip}
        />
      )

      default:
      break;
    }
  }

  footer = () => {
    const {
      view,
      mode,
      formData: {
        contact: {
          email_addresses_attributes: contactEmailData,
           ...contactData
         },
        company: {
          email_addresses_attributes: companyEmailData,
          ...companyData
        },
        ...data
      }
    } = this.state

    const formData = (
      Object.keys(contactData).length ||
      Object.keys(companyData).length ||
      contactEmailData.length ||
      companyEmailData.length ||
      Object.keys(data).length
    )

    if (view === 'chooseExisting') return null

    if (view === 'createCompany' || view === 'createContact') {
      return (
        <Fragment>
          {
             contactData || contactEmailData || companyData || companyEmailData?
            <Fragment>
              <button className="CreateClient--button" onClick={() => this.setView('form')}>
                <p>Cancel</p>
              </button>
              <button className="CreateClient--button" onClick={this.handleCreateOrUpdate}>
                <p>{`Create ${view === 'createCompany'? 'Company' : 'Contact'}`}</p>
              </button>
            </Fragment>
            :
            <button className="CreateClient--button" onClick={() => this.setView('form')}>
              <p>Cancel</p>
            </button>
          }
        </Fragment>
      )
    }
    if (formData) {
      return (
        <button className="CreateClient--button" onClick={this.handleSubmit}>
          <p>{mode === 'create'? 'CREATE' : 'SUBMIT'}</p>
        </button>
      )
    }

    return null
  }

  render (){
    const { mobile } = this.props
    const { mode, type } = this.state
    return (
      <div className="CreateClient">
        <div className="CreateClient--header">

          {
            mobile?
            <button
              className="CreateClient--back-button"
              onClick={this.props.close}
            >
              Back
            </button>
            :
            null
          }

          {
            mode === 'edit' && (type === 'contact' || type === 'company')?
            <button
              className="CreateClient--back-button"
              onClick={() => {
                this.setType('')
                this.setView('form')
              }}
            >
              Back
            </button>
            :
            null
          }

          <h2>
            {
              `
              ${mode === 'create'? 'Create' : 'Edit'}
              ${mode === 'edit'?
                  type === 'contact'?
                    'Contact'
                  :
                    type === 'company'?
                      'Company'
                    :
                      'Client'
                :
                  'Client'
                }
              `
            }
          </h2>

        </div>
        <div className="CreateClient--content">
          {this.content()}
        </div>
        <div className="CreateClient--footer">
          {this.footer()}
        </div>
      </div>
    )
  }
}
