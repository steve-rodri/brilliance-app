import React, { Component, Fragment } from 'react'
import Contact from './Contact'
import Company from './Company'
import { contact, company } from '../../../../../../../../services/BEP_APIcalls.js'
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
        companies: {}
      },
      formData: {
        contact: {},
        company: {}
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
    await this.searchForExisting()
  }

  componentWillUnmount(){
    this.axiosRequestSource = this.axiosRequestSource.cancel()
  }

  searchForExisting = async() => {
    await this.findContacts()
    await this.findCompanies()
  }

  findContacts = async() => {
    const { fields } = this.props
    if (!fields && !fields.client) return;
    const data = await contact.find({q: fields.client}, this.ajaxOptions)
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

  findCompanies = async() => {
    const { fields } = this.props
    if (!fields && !fields.client) return;
    const data = await company.find({q: fields.client}, this.ajaxOptions)
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

  skip = () => {
    this.setState({
      searchResults: {
        contacts: {},
        companies: {}
      }
    })
  }

  handleChange = (e, type) => {
    const { name, value } = e.target
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [type]: {
          ...prevState.formData[type],
          [name]: value
        }
      }
    }))
  }

  handleSubmit = async() => {
    const { formData: { contact: contactData, company: companyData }} = this.state
    const { createClient, close } = this.props
    let data = {}, newContact, newCompany;

    if(Object.keys(contactData).length) {
      newContact = await contact.create(contactData, this.ajaxOptions)
      data.contact_id = newContact.id
    }
    if(Object.keys(companyData).length) {
      newCompany = await company.create(companyData, this.ajaxOptions)
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

  setView = (view) => {
    this.setState({ view : view })
  }

  setPerson = () => {
    const { search } = this.state
    const terms = search.split(' ')
    this.setState(prevState => ({
      view: 'contact',
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          first_name: terms[0],
          last_name: terms[1]
        }
      }
    }))
  }

  setCompany = () => {
    const { search } = this.state
    this.setState(prevState => ({
      view: 'company',
      formData: {
        ...prevState.formData,
        company: {
          ...prevState.formData.company,
          name: search
        }
      }
    }))
  }

  content = () => {
    const { view, search, searchResults: { contacts, companies } } = this.state
    const contactData = contacts && contacts.data && contacts.data.length
    const companyData = companies && companies.data && companies.data.length

    switch (view) {
      case 'contact':
        return (
          <Fragment>
            {
              contactData?
              <ChooseContact
                search={search}
                contacts={contacts}
                handleSelect={this.handleSelect}
                skip={this.skip}
              />
              :
              <Contact
                {...this.props}
                {...this.state}
                handleChange={this.handleChange}
              />
            }
          </Fragment>
        )
      case 'company':
        return (
          <Fragment>
            {
              companyData?
              <ChooseCompany
                search={search}
                companies={companies}
                handleSelect={this.handleSelect}
                skip={this.skip}
              />
              :
              <Company
                {...this.props}
                {...this.state}
                handleChange={this.handleChange}
              />
            }
          </Fragment>
        )
      case 'complete':
      return (
        <Fragment>
        </Fragment>
      )
      default:
        return (
          <div className="CreateClient--opening">
            <h2>Is this a Person or a Company?</h2>
            <div>
              <div onClick={() => this.setPerson()}><p>Person</p></div>
              <div onClick={() => this.setCompany()}><p>Company</p></div>
            </div>
          </div>
        )
    }
  }

  render (){
    const { formData:{ contact, company } } = this.state
    const noFormData = !Object.keys(contact).length && !Object.keys(company).length
    return (
      <div className="CreateClient">
        <div className="CreateClient--header"><h2>Create Client</h2></div>
        <div className="CreateClient--content">
          {this.content()}
        </div>
        <div className="CreateClient--footer">
          {
            noFormData?
            <div className="CreateClient--button" onClick={this.props.close}>
              <p>Cancel</p>
            </div>
            :
            <div className="CreateClient--button" onClick={this.handleSubmit}>
              <p>CREATE</p>
            </div>
          }
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
          <div>
            <p>{`Found ${contacts.count} ${contacts.count === 1? 'contact' : 'contacts'} that match "${search}"`}</p>
            <p>Choose One to Make New Client.</p>
          </div>
          <div className="CreateClient--choose-existing-contacts">
            {
              contacts.data.map( contact => (
                <div key={contact.id} onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(contact.id, 'contact')
                }}>
                  <p>{contact.fullName}</p>
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
        <div onClick={skip}><h2>Skip</h2></div>
      </div>
    </div>
  )
}

function ChooseCompany(props){
  const { search, companies, handleSelect } = props
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

      <button>Skip</button>
    </div>
  )
}
