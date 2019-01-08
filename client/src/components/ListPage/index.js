import React, { Component } from 'react'
import List from '../List/index.js'
import './ListPage.css'

export default class ListPage extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  data(){
    if (this.props.events) {
      return this.props.events
    }
  }

  type(){
    if (this.props.events) {
      return 'events'
    }
  }

  render(){
    return (
      <div className='ListPage--container'>
        <aside>
          <h2>{this.props.title}</h2>
          <div className="ListPage--categories">
            {this.props.categories.map(category => (
              <a>{category}</a>
            ))}
          </div>
        </aside>
        <main>
          <h3>Category</h3>
          <List
            subtitles={this.props.subtitles}
            items={this.data()}
            type={this.type()}
          />
        </main>
      </div>
    )
  }
}
