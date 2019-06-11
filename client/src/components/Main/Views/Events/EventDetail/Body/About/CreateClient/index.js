import React, { Component, Fragment } from 'react'
import Contact from './Contact'
import Company from './Company'
import { contact, company, emailAddress } from '../../../../../../../../services/BEP_APIcalls.js'
import axios from 'axios'
import './index.css'

export default class CreateClient extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: '',
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

  async componentDidMount(){
    await this.searchForExisting()
  }

  componentWillUnmount(){
    this.axiosRequestSource = this.axiosRequestSource.cancel()
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
            first_name: words[0],
            last_name: words[1]
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

    const { createClient, close } = this.props
    let newContact, newCompany;

    if(Object.keys(contactData).length || contactEmailData.length) {
      newContact = await contact.create({ ...contactData, ...contactEmailData }, this.ajaxOptions)
      data.contact_id = newContact.id
    }
    if(Object.keys(companyData).length || companyEmailData.length) {
      newCompany = await company.create({ ...companyData, ...companyEmailData }, this.ajaxOptions)
      data.company_id = newCompany.id
    }

    if (Object.keys(data).length) await createClient(data)
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

  handleCreate = async() => {
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
        if( Object.keys(contactData).length || contactEmailData.length ) {
          const newContact = await contact.create({ ...contactData, ...contactEmailData }, this.ajaxOptions)
          this.setState(prevState => {
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
        if( Object.keys(companyData).length || companyEmailData.length ) {
          const newCompany = await company.create({ ...companyData, ...companyEmailData }, this.ajaxOptions)
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

  setView = (view) => {
    this.setState({ view : view })
  }

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
    const { view, type, search, searchResults: { contacts, companies } } = this.state
    switch (type) {
      case 'contact':
        switch (view) {
          case 'chooseExisting':
          return (
            <ChooseContact
              search={search}
              contacts={contacts}
              handleSelect={this.handleSelect}
              skip={this.skip}
            />
          )
          case 'form':
          return (
            <Contact
              {...this.props}
              {...this.state}
              handleChange={this.handleChange}
              handleSearchFieldChange={this.handleSearchFieldChange}
              onSearchFieldSelect={this.handleSearchFieldSelect}
              createCompany={this.createCompany}
              createEmailAddress={this.createEmailAddress}
            />
          )
          case 'createCompany':
          return (
            <Company
              {...this.props}
              {...this.state}
              handleChange={this.handleChange}
              handleSearchFieldChange={this.handleSearchFieldChange}
              onSearchFieldSelect={this.handleSearchFieldSelect}
              createContact={this.createContact}
              createEmailAddress={this.createEmailAddress}
            />
          )
          default:
          break;
        }
      break;
      case 'company':
        switch (view) {
          case 'chooseExisting':
          return (
            <ChooseCompany
              search={search}
              companies={companies}
              handleSelect={this.handleSelect}
              skip={this.skip}
            />
          )
          case 'form':
          return (
            <Company
              {...this.props}
              {...this.state}
              handleChange={this.handleChange}
              handleSearchFieldChange={this.handleSearchFieldChange}
              onSearchFieldSelect={this.handleSearchFieldSelect}
              createContact={this.createContact}
              createEmailAddress={this.createEmailAddress}
            />
          )
          case 'createContact':
          return (
            <Contact
              {...this.props}
              {...this.state}
              handleChange={this.handleChange}
              handleSearchFieldChange={this.handleSearchFieldChange}
              onSearchFieldSelect={this.handleSearchFieldSelect}
              createCompany={this.createCompany}
              createEmailAddress={this.createEmailAddress}
            />
          )
          default:
          break;
        }
      break;
      default:
      return (
        <div className="CreateClient--opening">
          <h2>Is this a Person or a Company?</h2>
          <div>
            <button onClick={() => this.setPerson()}><p>Person</p></button>
            <button onClick={() => this.setCompany()}><p>Company</p></button>
          </div>
        </div>
      )
    }
  }

  footer = () => {
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

    if (view === 'createCompany') {
      return (
        <Fragment>
          {
            companyData || companyEmailData?
            <Fragment>
              <button className="CreateClient--button" onClick={() => this.setView('form')}>
                <p>Cancel</p>
              </button>
              <button className="CreateClient--button" onClick={this.handleCreate}>
                <p>Create Company</p>
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

    if (view === 'createContact') {
      return (
        <Fragment>
          {
            contactData || contactEmailData?
            <Fragment>
              <button className="CreateClient--button" onClick={() => this.setView('form')}>
                <p>Cancel</p>
              </button>
              <button className="CreateClient--button" onClick={this.handleCreate}>
                <p>Create Contact</p>
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
          <p>CREATE</p>
        </button>
      )
    }

    return null
  }

  render (){
    const { mobile } = this.props
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

          <h2>Create Client</h2>
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

function ChooseContact(props){
  const { search, contacts, handleSelect, skip } = props
  return (
    <div className="CreateClient--choose">
      <div className="CreateClient--choose-existing">
        <h2>Found Existing Information:</h2>
        <div>
          <div className="CreateClient--choose-existing-dialog">
            <p>{`Found ${contacts.count} ${contacts.count === 1? 'contact' : 'contacts'} that matches`}</p>
            <p>{`"${search}"`}</p>
            <p>{`Choose ${contacts.count === 1? '' : 'ONE'} to make a New Client.`}</p>
          </div>
          <div className="CreateClient--choose-existing-contacts">
            {
              contacts.data.map( contact => (
                <button key={contact.id} onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(contact.id, 'contact')
                }}>
                  <p>{contact.fullName}</p>
                </button>
              ))
            }
          </div>
        </div>
      </div>

      <div className="CreateClient--divider">
        <div></div>
        <h2>OR</h2>
        <div></div>
      </div>

      <div className="CreateClient--skip">
        <button onClick={skip}><h2>Skip</h2></button>
      </div>
    </div>
  )
}

function ChooseCompany(props){
  const { search, companies, handleSelect, skip } = props
  return (
    <div className="CreateClient--choose">
      <div className="CreateClient--choose-existing">
        <h2>Choose From Existing:</h2>
        <div>
          <p>{`Found ${companies.count} ${companies.count === 1? 'company' : 'companies'} matching "${search}"`}</p>
          <div>
            {
              companies.data.map( company => (
                <div key={company.id} onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(company.id, 'company')
                }}>
                  <p>{company.name}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="CreateClient--divider">
        <div></div>
        <h2>OR</h2>
        <div></div>
      </div>

      <div className="CreateClient--skip">
        <button onClick={skip}><h2>Skip</h2></button>
      </div>
    </div>
  )
}
