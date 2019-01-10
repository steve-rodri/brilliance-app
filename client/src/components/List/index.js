import React, { Component } from 'react'
import ListItem from '../ListItem/index.js'
import './List.css'

export default class List extends Component {
  render(){
    const items = this.props.items
    const subtitles = this.props.subtitles
    return (
      <div>
        <div className="Titles" style={this.styleColumns(subtitles.length)}>
          {subtitles && subtitles.map((subtitle, id) => (
            <h5 key={id}>{subtitle}</h5>
          ))}
        </div>
        <div className="List">
        { items && items.map((item, id) => (
          <ListItem
            key={id}
            item={item}
            type={this.props.type}
            numColumns={subtitles.length}
            styleColumns={this.styleColumns}
          />
        ))}
        </div>
      </div>
    )
  }

  styleColumns(numColumns){
    return {
      gridTemplateColumns: `repeat(${numColumns}, 1fr)`
    }
  }
}
