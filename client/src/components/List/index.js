import React, { Component } from 'react'
import ListItem from '../ListItem/index.js'
import './List.css'

export default class List extends Component {
  render(){
    const items = this.props.items
    const subtitles = this.props.subtitles
    return (
      <div>
        <div className="Titles">
          {subtitles && subtitles.map(subtitle => (
            <h5>{subtitle}</h5>
          ))}
        </div>
        <div className="List">
        { items && items.map(item => (
          <ListItem
            key={item.id}
            item={item}
          />
        ))}
        </div>
      </div>
    )
  }
}
