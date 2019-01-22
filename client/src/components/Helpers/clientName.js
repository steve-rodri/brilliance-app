import React from 'react'

function clientName(client){
  if (client) {
    if (!client.contactInfo) {
      if (!client.company) {
        return null
      } else {
        return client.company.name
      }
    } else {
      if (!client.company) {
        return client.contactInfo.fullName
      } else {
        return (
          <div>
            <p>{client.contactInfo.fullName}</p>
            <h6>c: {client.company.name}</h6>
          </div>
        )
      }
    }
  }
}

export {
  clientName
}
