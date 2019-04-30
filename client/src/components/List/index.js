import React, { Component, Fragment } from 'react'
import ListItem from '../ListItem/index.js'
import InfiniteScroll from 'react-infinite-scroll-component'
import './index.css'

export default class List extends Component {
  render(){
    const {items, type, columnHeaders, load, hasMore } = this.props

    return (
      <div id="List" className="List">
        {columnHeaders && items && items.length?
          <div className="Titles">
            {columnHeaders && columnHeaders.map((header, id) => (
            <h6 key={id}>{header}</h6>
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
            scrollableTarget="List"
            endMessage={
              <Fragment>
                {
                  items && items.length?
                  null
                  :
                  <div className="List--None-Found"><p>None Found</p></div>
                }
              </Fragment>
            }
          >
            {items && items.map((item, id) => (
              <ListItem
                {...this.props}
                key={id}
                index={id}
                item={item}
                total={items.length}
                numColumns={columnHeaders && columnHeaders.length}
                displayColumn={displayColumn}
                styleColumns={styleColumns}
              />
            ))}
          </InfiniteScroll>
      </div>
    )

    function styleColumns(numColumns){
      if (type === 'Schedule') {
        return {
          color: 'white',
        }
      }
    }

    function displayColumn(headerName){
      if (columnHeaders) {
        const index = columnHeaders.findIndex( header => header === headerName ) + 1
        if ( index  ) {
          return { gridColumn: index }
        } else {
          return { display: 'none' }
        }
      } else {
        return { display: 'none' }
      }
    }
  }
}
