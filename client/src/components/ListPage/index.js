import React, { Component } from 'react'
import List from '../List/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListPage.css'

library.add(faPlus)

export default class ListPage extends Component {
  render(){
    return (
      <div className='ListPage--container'>
        <aside>
          <h2 className="ListPage--name">{this.props.title}</h2>
          <div className="ListPage--categories">
            {this.props.categories.map((category, id) => (
              <a href='#'key={id}>{category}</a>
            ))}
          </div>
          {this.props.title === "Events"?
            <div className="ListPage--button create" onClick={this.props.create}><span>Create New</span>{<FontAwesomeIcon icon="plus" size="2x"/>}</div>
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
            handleSelect={this.handleSelect}
          />
          {this.props.title === "Events"?
            <div className="ListPage--button create" onClick={this.props.create}><span>Create New</span>{<FontAwesomeIcon icon="plus" size="2x"/>}</div>
            :
            ''
          }
        </main>
      </div>
    )
  }
}
