import React, { Fragment } from "react";
import SearchField from "../../../../../../components/SearchField";

export default function Company(props) {
  const {
    type,
    fields,
    formData: {
      company,
      company: { email_addresses_attributes }
    },
    searchResults,
    handleChange,
    handleSearchFieldChange,
    onSearchFieldSelect
  } = props;
  const alignLeft = { textAlign: "left" };
  return (
    <div className="CreateClient--content">
      <label>Name</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          name="name"
          value={company.name ? company.name : ""}
          onChange={e => handleChange(e, "company")}
        />
      </div>

      <label>Phone</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          type="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          name="phone_number"
          value={company.phone_number ? company.phone_number : ""}
          onChange={e => handleChange(e, "company")}
        />
      </div>

      <label>Email</label>
      <SearchField
        searchResults={searchResults.emailAddresses.data}
        formClassName="Edit--Field"
        resultsClassName="Edit--results"
        resultClassName="Edit--result"
        formDataValue={
          email_addresses_attributes && email_addresses_attributes.length
        }
        formatResult={email => email.emailAddress}
        input={{
          className: "Input",
          name: "companyEmail",
          value: fields.companyEmail ? fields.companyEmail : ""
        }}
        handleChange={(name, value) =>
          handleSearchFieldChange({ target: { name, value } }, "companyEmail")
        }
        onEnter={onSearchFieldSelect}
        onSelect={onSearchFieldSelect}
        create={() => props.createEmailAddress("companyEmail")}
      />

      {type !== "contact" ? (
        <Fragment>
          <label>Contact</label>
          <SearchField
            searchResults={searchResults.contacts.data}
            formClassName="Edit--Field"
            resultsClassName="Edit--results"
            resultClassName="Edit--result"
            formDataValue={props.formData && props.formData.contact_id}
            formatResult={contact => contact.fullName}
            input={{
              className: "Input",
              name: "contact",
              value: fields.contact ? fields.contact : ""
            }}
            handleChange={(name, value) =>
              handleSearchFieldChange({ target: { name, value } }, "contact")
            }
            onEnter={onSearchFieldSelect}
            onSelect={onSearchFieldSelect}
            create={props.createContact}
          />
        </Fragment>
      ) : null}
    </div>
  );
}
