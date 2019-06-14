import React, { Fragment } from 'react'

export default function Address(props) {
  const { formData: { address }, onChange,  } = props
  const alignLeft = { textAlign: 'left' }
  return (
    <Fragment>
      <label>Street</label>
      <div className="Edit--Field">
        <input
          className="Input"
          style={alignLeft}
          name="street"
          value={address.street? address.street : ''}
          onChange={(e) => onChange(e, 'address')}
        />
      </div>

      <label>City</label>
      <div className="Edit--Field">
        <input
          className="Input"
          style={alignLeft}
          name="city"
          value={address.city? address.city : ''}
          onChange={(e) => onChange(e, 'address')}
        />
      </div>

      <label>State/Province</label>
      <div className="Edit--Field">
        <input
          className="Input"
          style={alignLeft}
          name="state"
          value={address.state? address.state : ''}
          onChange={(e) => onChange(e, 'address')}
        />
      </div>

      <label>Zip</label>
      <div className="Edit--Field">
        <input
          className="Input"
          style={alignLeft}
          name="zip"
          value={address.zip? address.zip : ''}
          onChange={(e) => onChange(e, 'address')}
        />
      </div>
    </Fragment>
  )
}
