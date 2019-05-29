import React from 'react'

export default function Contact(props){
  const { formData: { contact }, handleChange } = props
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

      <label>Phone</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          type="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          name="phone_number"
          value={contact.phone_number? contact.phone_number : ''}
          onChange={(e) => handleChange(e, 'contact')}
        />
      </div>

      {/* <label>Email</label>
      <div className="Edit--Field">
        <input
          className="Input"
          style={alignLeft}
          name=""
          value={contact.email}
        />
      </div> */}
    </div>
  )
}
