import React, { Component } from 'react'
import MainInfo from './MainInfo/index.js'
import moment from 'moment'
import { event } from '../../../services/event'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import './index.css'

library.add(faPencilAlt)
library.add(faCheck)

export default class BasicInfo extends Component {
  constructor(props){
    super(props)
    this.state = {
      editMode: false,
      formData: {}
    }
  }

  edit = () => {
    this.setState({editMode: !this.state.editMode})
  }

  handleEditSubmit = async() => {
    const { formData } = this.state
    await event.update(this.state.event.id, formData)
    this.resetForm();
    const updatedEvent = await event.getOne(this.state.event.id)
    this.setState({
      event:updatedEvent
    })
  }

  handleClientChange = (e) => {
    const { data } = e.target
    console.log(e.target.data)
  }

  handleChange = (e) => {
    const {name, value} = e.target
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

  resetForm = () => {
    this.setState({
      formData: {},
      editMode: false
    })
  }

  render(){
    const { event } = this.props
    const { editMode } = this.state
    return (
      <div className="BasicInfo--container">
        <div className="BasicInfo--header">
          <h1 className="BasicInfo--event-title">Event Title</h1>
          {editMode?
            <div className="BasicInfo--editButton" onClick={this.handleEditSubmit}><FontAwesomeIcon icon="check" size="2x"/></div>
            :
            <div className="BasicInfo--editButton" onClick={this.edit}><FontAwesomeIcon icon="pencil-alt" size="2x"/></div>}
        </div>
        <MainInfo event={event} editMode={this.state.editMode} handleChange={this.handleChange} handleClientChange={this.handleClientChange}/>

        <div className="BasicInfo--staff-and-notes">
          <div className="BasicInfo--staff-container">
          </div>
          <div className="BasicInfo--notes-container">
            <label>Notes</label>
            <p className="BasicInfo--notes">{event && event.notes? event.notes : ''}</p>
          </div>
        </div>
      </div>
    )
  }
}
