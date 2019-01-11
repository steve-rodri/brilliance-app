import React, { Component } from 'react'
import Standard from './Standard'
import Edit from './Edit'
import { client } from '../../../../services/client'
import './index.css'

export default class MainInfo extends Component {
  constructor (props){
    super(props)
    this.state = {
      formData: {}
    }
  }

  componentWillReceiveProps(newProps){
    const { event, editMode } = newProps
    this.setState({
      event,
      editMode
    })
  }

  async componentDidMount(){
    await this.fetchAllClients()
  }

  async fetchAllClients(){
    const clients = await client.getAll()
    this.setState({ clients })
  }

  getClientName(){
    const event = this.state.event
    if (event) {
      if (event.client) {
        const { client: { contactInfo: {fullName}}} = event
        return fullName
      }
    }
  }

  getClientId(){
    const event = this.state.event
    if (event) {
      if (event.client) {
        const { client: {id }} = event
        return id
      }
    }
  }

  view = () => {
    const { event, clients, editMode } = this.props
    if (editMode) {
      return (
        <Edit
        event={event}
        clients={clients}
        handleClientChange={this.props.handleClientChange}
        handleChange={this.props.handleChange}
        clientName={this.getClientName()}
        clientId={this.getClientId()}
        />
      )
    } else {
      return (
        <Standard
          event={event}
          clientName={this.getClientName()}
        />
      )
    }
  }

  render(){
    return this.view()
  }
}
