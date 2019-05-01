import React, { Fragment } from 'react'
// import moment from 'moment'
// import numeral from 'numeral'
import { name } from './helpers'

export default function SearchResult(props){
  const { item } = props
  return (
    <Fragment>
      <div className="SearchResult--image">img</div>
      <div className="SearchResult--kind"><p>{item.kind}</p></div>
      <div className="SearchResult--name"><p>{name(item)}</p></div>
      <div className="SearchResult--quantity"><h5>Qty:</h5></div>
      <div className="SearchResult--price"><h5>Price:</h5></div>
    </Fragment>
  )
}
