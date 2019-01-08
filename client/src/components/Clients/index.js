import React, { Component } from 'react'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render(){
    return (
      <div className="ListPage">
        <Header removeUser={this.props.removeUser}/>
        <ListPage title="Clients" categories={['All', 'Production', 'CANS', 'THC', 'CATP']}/>
      </div>
    )
  }
}