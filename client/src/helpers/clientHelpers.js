import React from "react";

export function clientDisplay(client, options) {
  let className = "";
  let oneLine = false;
  if (options) {
    let { oneLine: oL, className: cN } = options;
    oneLine = oL;
    className = cN;
  }

  if (client) {
    if (!client.contactInfo) {
      if (!client.company) {
        return null;
      } else {
        return <h3>{client.company.name}</h3>;
      }
    } else {
      if (!client.company) {
        return <h3>{client.contactInfo.fullName}</h3>;
      } else if (oneLine) {
        return (
          <h3>{`${client.contactInfo.fullName} : ${client.company.name}`}</h3>
        );
      } else {
        return (
          <div className={`${className} client`}>
            <h3>{client.contactInfo.fullName}</h3>
            <h5>c: {client.company.name}</h5>
          </div>
        );
      }
    }
  }
}

export function clientName(client) {
  if (!client) return "";
  if (!client.contactInfo) {
    if (!client.company) return "";
    return client.company.name;
  } else {
    if (!client.company) return client.contactInfo.fullName;
    return `${client.contactInfo.fullName} : ${client.company.name}`;
  }
}

export function clientInfo(client) {
  if (client) {
    if (!client.contactInfo) {
      if (!client.company) {
        return null;
      } else {
        return {
          name: client.company.name,
          logo: client.company.logo,
          phoneNumber: client.company.phoneNumber,
          website: client.company.website,
          email: client.company.emailAddresses
        };
      }
    } else {
      if (!client.company) {
        return {
          name: client.contactInfo.fullName,
          phoneNumber: client.contactInfo.phoneNumber,
          photo: client.contactInfo.photo,
          emailAddresses: client.contactInfo.emailAddresses
        };
      } else {
        return {
          name: client.contactInfo.fullName,
          phoneNumber: client.contactInfo.phoneNumber,
          companyNumber: client.company.phoneNumber,
          emailAddresses: client.contactInfo.emailAddresses,
          logo: client.company.logo
        };
      }
    }
  }
}

export function contactName(contact) {
  return contact.fullName;
}

export function companyName(company) {
  return company.name;
}
