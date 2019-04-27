import React, { Component } from 'react'
import { searchIcon } from '../../helpers/icons'
import './Search.css'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      query:''
    }
  }

  handleFocusSelect = (e) => {
    e.target.select()
  }

  handleChange = (e) => {
    this.setState({
      query: e.target.value
    })
  }

  handleSubmit = (e) => {
    const { url, refresh } = this.props
    e.preventDefault();
    refresh(true, `${url}?q=${this.state.query}`)
  }

  render(){
    return(
      <form className="search" autoComplete="off" onSubmit={this.handleSubmit}>
        {searchIcon('1x', 'search--icon')}
        <input
          name="query"
          type="text"
          className="search--input"
          value={this.state.query}
          onChange={this.handleChange}
          onFocus={this.handleFocusSelect}
        />
      </form>
    )
  }
}
