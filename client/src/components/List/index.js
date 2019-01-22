import React, { Component } from 'react'
import ListItem from '../ListItem/index.js'
import InfiniteScroll from 'react-infinite-scroller'
import './List.css'


export default class List extends Component {
  render(){
    const {items, type, subtitles, load, hasMore } = this.props

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
        <div className="List">
          <InfiniteScroll
            pageStart={0}
            loadMore={load}
            hasMore={hasMore}
            loader={<div className="loader" key={1}>Loading...</div>}
            useWindow={false}
          >
            {items && items.map((item, id) => (
              <ListItem
                user={this.props.user}
                key={id}
                item={item}
                type={this.props.type}
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
  }
}
