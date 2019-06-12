import * as addressParser from 'parse-address'

export const parseAddress = (address) => {
  let addressObj = addressParser.parseLocation(address)
  addressObj.street = `
  ${addressObj.number? addressObj.number : ''}
  ${addressObj.prefix? addressObj.prefix : ''}
  ${addressObj.street? addressObj.street : ''}
  ${addressObj.type? addressObj.type : ''}
  `
  addressObj.street = addressObj.street.trim()
  delete addressObj.number
  delete addressObj.prefix
  delete addressObj.type
  return addressObj
}
