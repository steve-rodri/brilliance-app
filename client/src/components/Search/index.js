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
    const { url, history } = this.props
    e.preventDefault();
    history.push(`${url}?q=${this.state.query}`)
    this.setState({query: ''})
  }

  render(){
    const { className } = this.props
    return(
      <form className={`search ${className}`} onSubmit={this.handleSubmit}>
        <div className="search--icon">{searchIcon('1x')}</div>
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
