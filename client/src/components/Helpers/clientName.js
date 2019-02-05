import React from 'react'

function clientName(client, oneLine){
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
      } else if (oneLine) {
        return `${client.contactInfo.fullName} : ${client.company.name}`
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
