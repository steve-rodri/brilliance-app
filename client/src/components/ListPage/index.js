import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import List from '../List/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListPage.css'

library.add(faPlus)

export default class ListPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToCreateNew: false
    }
  }

  createNew = () => {
    this.setState({
      redirectToCreateNew: true
    })
  }

  render(){
    const { match } = this.props
    if (this.state.redirectToCreateNew) return (<Redirect to={`${match.path}/new`}/>)
    return (
      <div className='ListPage--container'>
        <aside>
          <h2 className="ListPage--name">{this.props.title}</h2>
          <div className="ListPage--categories">
            {this.props.categories.map((category, id) => (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  this.props.fetchByCategory(category)
                }}
                key={id}>{category}
              </div>
            ))}
          </div>
          {this.props.title === "Events"?
            <div
              className="ListPage--button create"
              onClick={this.createNew}
              style={{border: 'none'}}
            >
              <span className="button-text">Create New</span>
              {<FontAwesomeIcon className="plus-icon" icon="plus" size="2x"/>}
            </div>
            :
            ''
          }
        </aside>
        <main>
          <h3 className="ListPage--category-title">All</h3>
          <List
            subtitles={this.props.subtitles}
            items={this.props.data}
            type={this.props.title}
            create={this.createNew}
            load={this.props.load}
            hasMore={this.props.hasMore}
            handleSelect={this.handleSelect}
          />
        </main>
      </div>
    )
  }
}
