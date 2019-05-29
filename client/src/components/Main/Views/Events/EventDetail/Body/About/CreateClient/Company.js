import React from 'react'

export default function Company(props){
  const { formData: { company }, handleChange } = props
  const alignLeft = { textAlign: 'left' }
  return (
    <div className="CreateClient--content">

      <label>Name</label>
      <div className="Edit--Field">
        <input
          autoComplete="off"
          className="Input"
          style={alignLeft}
          name="name"
          value={company.name? company.name : ''}
          onChange={(e) => handleChange(e, 'company')}
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
          value={company.phone_number? company.phone_number : ''}
          onChange={(e) => handleChange(e, 'company')}
        />
      </div>

      {/* <label>Email</label>
      <div className="Edit--Field">
        <input
          className="Input"
          style={alignLeft}
          name="email_address"
          value={company.email}
        />
      </div> */}

    </div>
  )
}
