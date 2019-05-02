import React, { Fragment } from 'react'
// import moment from 'moment'
// import numeral from 'numeral'
import { itemName, itemPhoto } from './helpers'

export default function SearchResult(props){
  const { item } = props
  const photo = itemPhoto(item)
  const name = itemName(item)
  return (
    <Fragment>
      <div className="SearchResult--image">{photo? <img src={photo} alt={name}/> : null}</div>
      <div className="SearchResult--kind"><p>{item.kind}</p></div>
      <div className="SearchResult--name"><p>{name}</p></div>
      <div className="SearchResult--quantity"><h5>Qty:</h5></div>
      <div className="SearchResult--price"><h5>Price:</h5></div>
    </Fragment>
  )
}
