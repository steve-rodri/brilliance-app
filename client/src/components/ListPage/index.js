import React, { Component } from 'react'
import List from '../List/index.js'
import './ListPage.css'

export default class ListPage extends Component {

  sort(e){
    console.log(e.target.innerHTML)
  }



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
          <h3>Category</h3>
          <List
            subtitles={this.props.subtitles}
            items={this.props.data}
            type={this.props.title}
            handleSelect={this.handleSelect}
          />
        </main>
      </div>
    )
  }
}
