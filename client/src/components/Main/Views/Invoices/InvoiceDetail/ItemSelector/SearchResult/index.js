import React, { Fragment } from 'react'
import { lineName, linePhoto, inventoryName } from './helpers'
import { quantity, price, inventoryPrice } from '../../Invoice/Line/Helpers'

export default function SearchResult(props){
  const { inv, item, type } = props
  switch (type) {
    case 'past invoices':
      const lPhoto = linePhoto(item)
      const lName = lineName(item)
      return (
        <Fragment>
          <div className="SearchResult--image">{lPhoto? <img src={lPhoto} alt={lName}/> : null}</div>
          <div className="SearchResult--kind"><p>{item.kind}</p></div>
          <div className="SearchResult--name"><p>{lName}</p></div>
          <div className="SearchResult--quantity">
            <h5>Qty:</h5>
            <div>{quantity(item)}</div>
          </div>
          <div className="SearchResult--price">
            <h5>Price:</h5>
            <div>{price(item, inv.kind, true)}</div>
          </div>
        </Fragment>
      )
    case 'inventory':
      const iName = inventoryName(item)
      return (
        <Fragment>
          <div className="SearchResult--image">{item.photo? <img src={item.photo} alt={iName}/> : null}</div>
          <div className="SearchResult--kind"><p>{item.kind}</p></div>
          <div className="SearchResult--name"><p>{iName}</p></div>
          <div className="SearchResult--price">
            <h5>Price:</h5>
            <div>{inventoryPrice(item, inv.kind, true)}</div>
          </div>
        </Fragment>
      )
    default:
    return null
  }
}
