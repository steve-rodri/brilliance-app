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
        {type !== 'Clients'?
          <div className="Titles" style={style()}>
            {subtitles && subtitles.map((subtitle, id) => (
            <h5 key={id}>{subtitle}</h5>
            ))}
          </div>
          :
          null
        }
        <div id="List" className="List" style={styleList()}>
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
