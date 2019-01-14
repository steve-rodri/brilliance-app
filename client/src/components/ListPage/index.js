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
          <h2>{this.props.title}</h2>
          <div className="ListPage--categories">
            {this.props.categories.map((category, id) => (
              <p onClick={this.sort} key={id}>{category}</p>
            ))}
          </div>
        </aside>
        <main>
          <h3 className="ListPage--category-title">Category</h3>
          <List
            subtitles={this.props.subtitles}
            items={this.props.data}
            type={this.props.title}
            handleSelect={this.handleSelect}
          />
          <button className="ListPage--button create" onClick={this.props.create}>Create New {<FontAwesomeIcon icon="plus" size="2x"/>}</button>
        </main>
      </div>
    )
  }
}
