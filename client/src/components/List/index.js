import React, { Component } from 'react'
import ListItem from '../ListItem/index.js'
import './List.css'

export default class List extends Component {
  constructor(props){
    super(props)
    this.state = {
      items: []
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({
      newProps
    })
  }

  render(){
    return (
      <div>

      <ListItem />
      </div>
    )
  }
}
