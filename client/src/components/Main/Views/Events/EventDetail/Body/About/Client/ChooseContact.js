import React from 'react'

export default function ChooseContact(props){
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
