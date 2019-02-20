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

  handleSubmit = (e) => {
    const { url, history } = this.props
    e.preventDefault();
    history.push(`${url}?q=${this.state.query}`)
  }

  render(){
    const { subject } = this.props
    return(
      <form className="search" autoComplete="off" onSubmit={this.handleSubmit}>
        <input
          name="query"
          type="text"
          placeholder={`search ${subject.toLowerCase()}...`}
          value={this.state.query}
          onChange={this.handleChange}
        />
      </form>
    )
  }
}
