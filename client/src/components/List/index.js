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
          {subtitles && subtitles.map((subtitle, id) => (
            <h5 key={id}>{subtitle}</h5>
          ))}
        </div>
        <div className="List">
        { items && items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            type={this.props.type}
          />
        ))}
        </div>
      </div>
    )
  }
}
