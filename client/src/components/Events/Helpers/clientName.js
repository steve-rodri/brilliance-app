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
        return `${client.contactInfo.fullName} - ${client.company.name}`
      }
    }
  }
}

export {
  clientName
}
