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
          <div className="client">
            <p>{client.contactInfo.fullName}</p>
            <h6>c: {client.company.name}</h6>
          </div>
        )
      }
    }
  }
}

function clientInfo(client){
  if (client) {
    if (!client.contactInfo) {
      if (!client.company) {
        return null
      } else {
        return {
          name: client.company.name,
          logo: client.company.logo,
          phoneNumber: client.company.phoneNumber,
          website: client.company.website,
          email: client.company.emailAddresses
        }
      }
    } else {
      if (!client.company) {
        return {
          name: client.contactInfo.fullName,
          phoneNumber: client.contactInfo.phoneNumber,
          photo: client.contactInfo.photo,
          emailAddresses: client.contactInfo.emailAddresses
        }
      } else {
        return {
          name: client.contactInfo.fullName,
          phoneNumber: client.contactInfo.phoneNumber,
          companyNumber: client.company.phoneNumber,
          emailAddresses: client.contactInfo.emailAddresses,
          logo: client.company.logo
        }
      }
    }
  }
}

function contactName(contact){
  return contact.fullName
}

function companyName(company){
  return company.name
}


export {
  clientName,
  clientInfo,
  contactName,
  companyName
}
