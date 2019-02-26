import React, { Component } from 'react'
import ListItem from '../ListItem/index.js'
import InfiniteScroll from 'react-infinite-scroll-component'
import './List.css'


export default class List extends Component {

  render(){
    const {items, type, columnHeaders, load, hasMore } = this.props

    const style = () => {
      if (columnHeaders) {
        return styleColumns(columnHeaders.length)
      } else {
        return {}
      }
    }

    const styleList = () => {
      if (items && items.length) {
        return {}
      } else {
        return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%'
        }
      }
    }

    return (
      <div className="List--container">
        <div id="List" className="List" style={styleList()}>
          {columnHeaders?
            <div className="Titles" style={style()}>
              {columnHeaders && columnHeaders.map((header, id) => (
              <h5 key={id}>{header}</h5>
              ))}
            </div>
            :
            null
          }
            <InfiniteScroll
              style={{overflow: 'hidden'}}
              dataLength={items && items.length}
              next={load}
              hasMore={hasMore}
              loader={<div className="List--Loader"></div>}
              endMessage=
              {
                <div className="List--End-Message">
                  {items?
                    <div></div>
                    :
                    <div>None Found</div>
                  }
                </div>
              }
              scrollableTarget="List"
            >
              {items && items.map((item, id) => (
                <ListItem
                  user={this.props.user}
                  key={id}
                  item={item}
                  type={this.props.type}
                  handleStatusChange={this.props.handleStatusChange}
                  displayColumn={displayColumn}
                  numColumns={columnHeaders && columnHeaders.length}
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
      } else if (type === "Clients") {
        return {
          gridTemplateColumns: `1fr 2fr 1fr`
        }
      } else {
        return {
        gridTemplateColumns: `repeat(${numColumns}, 1fr)`
        }
      }
    }

    function displayColumn(headerName){
      if (columnHeaders) {
        if ( columnHeaders.find( header => header === headerName ) ) {
          return {}
        } else {
          return { display: 'none' }
        }
      } else {
        return { display: 'none' }
      }
    }
  }
}
