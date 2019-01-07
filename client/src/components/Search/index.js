import React, { Component } from 'react'
import './Search.css'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      query:''
    }
  }

  handleChange = (e) => {
    this.setState({
      query: e.target.value
    })
  }

  render(){
    return(
      <form className="search">
        <input
          name="query"
          type="text"
          placeholder="search..."
          value={this.state.query}
          onChange={this.handleChange}
        />
      </form>
    )
  }
}
