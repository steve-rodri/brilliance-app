import React, { Component } from 'react'
import Standard from './Standard'
import Edit from './Edit'
import './index.css'

export default class MainInfo extends Component {
  constructor (props){
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(newProps){
    const { event, editMode } = newProps
    this.setState({
      event,
      editMode
    })
  }

  view = () => {
    const { searchFieldData, event, editMode, fields } = this.props
    if (editMode) {
      return (
        <Edit
        event={event}
        searchFieldData={searchFieldData}
        fields={fields}
        onSelect={this.props.handleSelect}
        handleSearchChange={this.props.handleSearchChange}
        handleChange={this.props.handleChange}
        />
      )
    } else {
      return (
        <Standard
          event={event}
          fields={fields}
        />
      )
    }
  }

  render(){
    return this.view()
  }
}
