import React, { Component, Fragment } from 'react'
import ListItem from '../ListItem/index.js'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from '../Loader'
import './index.css'

export default class List extends Component {
  constructor(props){
    super(props)
    this.container = React.createRef()
  }

  componentWillUnmount(){
    const { setScrollPosition } = this.props
    setScrollPosition(this.container.current.scrollTop)
  }

  componentDidMount(){
    const { listScrollPosition } = this.props
    this.container.current.scrollTop = listScrollPosition
  }

  render(){
    const {page, items, view, columnHeaders, load, hasMore, loading } = this.props

    return (
      <div id="List" className="List" ref={this.container}>
        {columnHeaders && items && items.length?
          <div className="Titles">
            {columnHeaders && columnHeaders.map((header, i) => {
              // const indices = findIndices(columnHeaders, header)
              if (columnHeaders[i] === columnHeaders[i - 1]) {
                return <h5 key={i}>{}</h5>
              } else {
                return <h5 key={i}>{header}</h5>
              }
            })}
          </div>
          :
          null
        }
          <InfiniteScroll
            dataLength={items && items.length}
            next={() => page >= 1? load() : null}
            hasMore={hasMore}
            loader=
            {
              <div className="List--Loader">
                <Loader />
              </div>
            }
            scrollableTarget="List"
            endMessage={
              <Fragment>
                {
                  items && items.length?
                  null
                  :
                  !loading?
                    <div className="List--None-Found"><p>None Found</p></div>
                    :
                    <Loader />
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
      if (view === 'Dashboard') {
        return {
          color: 'white',
        }
      }
    }

    function displayColumn(headerName){
      let style = { display: 'none'};

      if (columnHeaders) {
        const indices = columnHeaders.flatMap( (header, i) => {
          if (header === headerName ) return i
          return []
        })

        if (indices.length === 1) {
          style.display = 'grid'
          style.gridColumn = indices[0] + 1
        }

        if (indices.length > 1) {
          style.display = 'grid'
          style.gridColumn = `${indices[0] + 1} / span ${indices.length}`
        }

      }

      return style;
    }

    function findIndices(arr, val){
      let indexes = []
      let i = -1;

      while ((i = arr.indexOf(val, i+1)) !== -1){
        indexes.push(i);
      }

      return indexes;
    }
  }
}
