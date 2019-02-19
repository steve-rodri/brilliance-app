import React, { Component } from 'react'
import ListItem from '../ListItem/index.js'
import InfiniteScroll from 'react-infinite-scroll-component'
import './List.css'


export default class List extends Component {
  render(){
    const {category, items, type, subtitles, load, hasMore } = this.props

    const style = () => {
      if (subtitles) {
        return styleColumns(subtitles.length)
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
        <div id="List" className="List">
          <InfiniteScroll
            dataLength={items.length}
            next={load}
            hasMore={hasMore}
            loader={<div className="loader">Loading...</div>}
            scrollableTarget="List"
            key={category}
          >
            {items && items.map((item, id) => (
              <ListItem
                user={this.props.user}
                key={id}
                item={item}
                type={this.props.type}
                displayColumn={displayColumn}
                numColumns={subtitles && subtitles.length}
                styleColumns={this.styleColumns}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    )

    function styleColumns(numColumns){
      if (type === 'Schedule') {
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

    function displayColumn(headerName){
      if ( subtitles.find( header => header === headerName ) ) {
        return {}
      } else {
        return {
          display: 'none'
        }
      }
    }
  }
}
