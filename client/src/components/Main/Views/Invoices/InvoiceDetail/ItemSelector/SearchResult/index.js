import React, { Fragment } from 'react'
import {
  lineQty,
  linePrice,
  linePhoto,
  itemDescription,
  inventoryName,
  inventoryPrice
} from '../../Invoice/Line/Helpers'

export default function SearchResult(props){
  const { result, inv, type } = props
  switch (type) {
    case 'past invoices':
      const line = result
      const photo = linePhoto(line)
      const description = itemDescription(line.item)
      return (
        <Fragment>
          <div className="SearchResult--image">{photo? <img src={photo} alt={description}/> : null}</div>
          <div className="SearchResult--kind"><p>{line.item.kind}</p></div>
          <div className="SearchResult--name"><p>{description}</p></div>
          <div className="SearchResult--quantity">
            <h5>Qty:</h5>
            <div>{lineQty(line)}</div>
          </div>
          <div className="SearchResult--price">
            <h5>Price:</h5>
            <div>{linePrice(line, inv.kind, { format: true })}</div>
          </div>
        </Fragment>
      )
    case 'inventory':
      const inventory = result
      const name = inventoryName(inventory)
      return (
        <Fragment>
          <div className="SearchResult--image">{inventory.photo? <img src={inventory.photo} alt={name}/> : null}</div>
          <div className="SearchResult--kind"><p>{inventory.kind}</p></div>
          <div className="SearchResult--name"><p>{name}</p></div>
          <div className="SearchResult--price">
            <h5>Price:</h5>
            <div>{inventoryPrice(inventory, inv.kind, true)}</div>
          </div>
        </Fragment>
      )
    default:
    return null
  }
}
