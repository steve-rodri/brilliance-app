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

    return (
      <div className="List--container">
        <div id="List" className="List">
          {columnHeaders && items && items.length?
            <div className="Titles" style={style()}>
              {columnHeaders && columnHeaders.map((header, id) => (
              <h5 key={id}>{header}</h5>
              ))}
            </div>
            :
            null
          }
            <InfiniteScroll
              dataLength={items && items.length}
              next={load}
              hasMore={hasMore}
              loader=
              {
                <div className="List--Loader">
                  <div className="lds-ellipsis">
                    <div>
                    </div>
                    <div>
                    </div>
                    <div>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              }
              endMessage=
              { items && items.length?
                <div className="List--End-Message">
                  <h4>{`Found ${items.length} ${type}`}</h4>
                </div>
                :
                <div className="List--None-Found">
                  <h2>Nothing Found</h2>
                  <p>Try another search...</p>
                </div>
              }
              scrollableTarget="List"
            >
              {items && items.map((item, id) => (
                <ListItem
                  key={id}
                  item={item}
                  numColumns={columnHeaders && columnHeaders.length}
                  displayColumn={displayColumn}
                  styleColumns={styleColumns}
                  {...this.props}
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
