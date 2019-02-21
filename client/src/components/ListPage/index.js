import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from '../List/index.js'
import Search from '../Search/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListPage.css'

library.add(faPlus)

export default class ListPage extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  styleActiveMenu = (category) => {
    if (this.props.category === category) {
      return (
        {
          color: 'white',
          borderLeft: '1px solid var(--light-gray)',
          borderRight: '1px solid var(--light-gray)'
        }
      )
    } else {
      return {}
    }
  }

  styleSubTitle = () => {
    if (this.props.category === 'All') {
      return { display: 'none'}
    } else {
      return {}
    }
  }

  render(){
    const {
      title,
      subtitles,
      type,
      category,
      categories,
      data,
      hasMore,
      match,
      history,
    } = this.props

    return (
      <div className='ListPage--container'>
        <aside>

          {/* Title */}
          <h2
            className="ListPage--name"
            onClick={(e) => {
              e.stopPropagation()
              history.push(match.path)
            }}
          >
            {title}
          </h2>

          {/* Search */}
          <Search
            subject={title}
            url={match.path}
            history={history}
          />

          {/* Categories */}
          <div className="ListPage--categories">
            {categories && categories.map((category, id) => (
              <div
                style={this.styleActiveMenu(category)}
                onClick={(e) => {
                  e.stopPropagation()
                  history.push(`${match.path}?category=${category}`)
                }}
                key={id}>{category}
              </div>
            ))}
          </div>

          {/* Add New Button */}
          {type === "Events" || type === "Clients"?
            <Link
              to={{pathname: `${match.path}/new`, state: { modal: true } }}
              style={{textDecoration: 'none', color: 'black', width: '100%'}}
            >

              <div className="ListPage--button create">
                <span className="button-text">Add New</span>
                {<FontAwesomeIcon className="button-icon" icon="plus" size="2x"/>}
              </div>

            </Link>
            :
            null
          }

        </aside>

        <main>

          <h3 className="ListPage--category-title" style={this.styleSubTitle()}>{category}</h3>
          <List
            title={category}
            subtitles={subtitles}
            items={data}
            type={type}
            create={this.createNew}
            load={this.props.load}
            hasMore={hasMore}
            handleSelect={this.handleSelect}
          />

        </main>

      </div>
    )
  }
}
