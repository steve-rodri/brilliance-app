import React, { Component } from "react";
import SearchField from "../../components/SearchField/";
import { contactName, companyName } from "../../helpers/clientHelpers";
import { contact, company } from "../../services/BEP_APIcalls.js";
import axios from "axios";

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      fields: {},
      searchFieldData: null
    };
    this.axiosRequestSource = axios.CancelToken.source();
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: false
    };
  }

  componentWillUnmount() {
    this.axiosRequestSource && this.axiosRequestSource.cancel();
  }

  handleChange = async (name, value) => {
    this.setField(name, value);

    switch (name) {
      case "contact":
        const contacts = await this.findContacts(value);

        if (!value || !contacts || contacts.length < 0) {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              contact_id: null
            }
          }));
        } else {
          this.setState(prevState => ({
            searchFieldData: {
              ...prevState.searchFieldData,
              contacts
            }
          }));
        }

        break;

      case "company":
        const companies = await this.findCompanies(value);

        if (!value || !companies || companies.length < 0) {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              company_id: null
            }
          }));
        } else {
          this.setState(prevState => ({
            searchFieldData: {
              ...prevState.searchFieldData,
              companies
            }
          }));
        }

        break;

      default:
        break;
    }
  };

  setField = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    }));
  };

  findContacts = async query => {
    const q = query.split("");
    if (q.length > 2) {
      const data = await contact.find({ q: query }, this.ajaxOptions);
      return data.contacts;
    }
  };

  findCompanies = async query => {
    const q = query.split("");
    if (q.length > 2) {
      const data = await company.find({ q: query }, this.ajaxOptions);
      return data.companies;
    }
  };

  handleFormSubmit = (e, name, index) => {
    if (e.key === "Tab" || e.key === "Enter") {
      this.handleSelect(e, name, index);
    }
  };

  handleSelect = (e, name, index) => {
    let item;
    const { searchFieldData } = this.state;

    if (searchFieldData) {
      switch (name) {
        case "contact":
          item = searchFieldData.contacts[index];
          const contact = contactName(item);
          if (item) {
            this.setState(prevState => ({
              formData: {
                ...prevState.formData,
                contact_id: item.id
              },
              fields: {
                ...prevState.fields,
                contact
              }
            }));
          }

          break;

        case "company":
          item = searchFieldData.companies[index];
          const company = companyName(item);

          if (item) {
            this.setState(prevState => ({
              formData: {
                ...prevState.formData,
                company_id: item.id
              },
              fields: {
                ...prevState.fields,
                company
              }
            }));
          }

          break;
        default:
          break;
      }
    }
  };

  handleSubmit = async () => {
    const { create, match, history } = this.props;
    const item = await create(this.state.formData);
    const url = () => {
      let words = `${match.path}`.split("/");
      words.pop();
      const link = words.join("/");
      return link;
    };
    history.push(`${url()}/${item.id}`);
  };

  render() {
    const {
      fields: { contact, company },
      formData: { contact_id, company_id },
      searchFieldData
    } = this.state;

    return (
      <div className="Client-Modal--Content">
        <h2 className="Client-Modal--Title">Create New Client</h2>

        <div className="Client-Modal--Fields">
          <SearchField
            searchResults={searchFieldData && searchFieldData.contacts}
            formClassName="Client-Modal--Field"
            resultClassName="search-result"
            resultsClassName="search-results"
            formDataValue={contact_id}
            input={{
              className: "search-input",
              placeholder: "search contacts...",
              name: "contact",
              value: contact ? contact : "",
              tabIndex: 1
            }}
            formatResult={contactName}
            handleChange={this.handleChange}
            onEnter={this.handleFormSubmit}
            onSelect={this.handleSelect}
          />

          <SearchField
            searchResults={searchFieldData && searchFieldData.companies}
            formClassName="Client-Modal--Field"
            resultClassName="search-result"
            resultsClassName="search-results"
            formDataValue={company_id}
            input={{
              className: "search-input",
              placeholder: "search companies...",
              name: "company",
              value: company ? company : "",
              tabIndex: 2
            }}
            formatResult={companyName}
            handleChange={this.handleChange}
            onEnter={this.handleFormSubmit}
            onSelect={this.handleSelect}
          />

          {/* <label className="Client-Modal--Label">First Name</label>
            <input
              className="Client-Modal--Field"
              name="firstName"
              value={firstName? firstName : ''}
              onChange={this.handleChange}
              tabIndex='1'
            />

          <label className="Client-Modal--Label">Last Name</label>
            <input
              className="Client-Modal--Field"
              name="lastName"
              value={lastName? lastName : ''}
              onChange={this.handleChange}
              tabIndex='2'
            />

          <label className="Client-Modal--Label">Phone</label>
            <input
              className="Client-Modal--Field"
              name="phone"
              value={phone? phone : ''}
              onChange={this.handleChange}
              tabIndex='3'
            />

          <label className="Client-Modal--Label">Email</label>
            <input
              className="Client-Modal--Field"
              name="email"
              value={email? email : ''}
              onChange={this.handleChange}
              tabIndex='4'
            />

          <div className="Client-Modal--Buttons">
            <button className="Client-Modal--Button" type='submit'>Create</button>
          </div> */}
        </div>
        <div className="Client-Modal--Buttons">
          <button className="Client-Modal--Button" onClick={this.handleSubmit}>
            Create
          </button>
        </div>
      </div>
    );
  }
}
