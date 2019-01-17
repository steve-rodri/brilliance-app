import React, { Component } from 'react'
import ListItem from '../ListItem/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './List.css'

library.add(faPlus)

export default class List extends Component {
  render(){
    const items = this.props.items
    const subtitles = this.props.subtitles
    const style = () => {
      if (subtitles) {
        return this.styleColumns(subtitles.length)
      } else {
        return {}
      }
    }

    return (
      <div className="List--container">
        <div className="Titles" style={style()}>
          {subtitles && subtitles.map((subtitle, id) => (
            <h5 key={id}>{subtitle}</h5>
          ))}
        </div>
        <div className="List">
        { items && items.map((item, id) => (
          <ListItem
            user={this.props.user}
            key={id}
            item={item}
            type={this.props.type}
            numColumns={subtitles && subtitles.length}
            styleColumns={this.styleColumns}
          />
        ))}
        {this.props.type === "Events"?
          <div className="ListPage--button create" onClick={this.props.create}><span className="button-text">Create New</span>{<FontAwesomeIcon className="plus-icon" icon="plus" size="2x"/>}</div>
          :
          ''
        }
        </div>
      </div>
    )
  }

  styleColumns(numColumns){
    if (this.props.type === 'Schedule') {
      return {
        color: 'white',
        gridTemplateColumns: `repeat(${numColumns}, 1fr)`
      }
    } else {
      return {
      gridTemplateColumns: `repeat(${numColumns}, 1fr)`
      }
    }
  }
}
