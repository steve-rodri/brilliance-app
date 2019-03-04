import React, { Component } from 'react'
import Edit from './Edit'
import View from './View'
import Modal from 'react-modal'
import StaffSelector from './StaffSelector'
import { eventEmployee } from '../../../../../../../services/eventEmployee'
import { employee } from '../../../../../../../services/employee'
import './index.css'

Modal.setAppElement('#root')

export default class Staff extends Component {
  constructor(props){
    super(props)
    this.state = {
      workers: null,
      employees: null,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setWorkers(nextProps)
  }

  componentDidMount(){
    this.setWorkers(this.props)
  }

  setWorkers = (props) => {
    const { evt } = props
    if (evt) {
      if (evt.staff) {
        console.log(evt.staff)
        this.setState({
          workers: evt.staff
        })
      }
    }
  }

  getParent = () => {
    return document.querySelector('.BasicInfo--container')
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  chooseWorker = async() => {
    await this.getActiveEmployees()
    await this.openModal()
  }

  handleEmployeeSelect = (employee) => {
    const workers = [...this.state.workers]
    const scheduled = workers.find(worker => worker.info.id === employee.id)
    if (scheduled) {
      this.removeWorker(scheduled)
    } else {
      this.addWorker(employee)
    }
  }

  addWorker = async (employee) => {
    const evt  = { ...this.props.evt }
    const workers = [...this.state.workers]
    const newWorker = await eventEmployee.create({
      event_id: evt.id,
      employee_id: employee.id
    })
    workers.push(newWorker)
    this.setState({ workers })
    evt.staff = workers
    this.props.handleUpdate(evt)
  }

  removeWorker = async (worker) => {
    const evt  = { ...this.props.evt }
    const workers = [...this.state.workers]
    await eventEmployee.delete(worker.id)
    const updatedWorkers = workers.filter(w => w.id !== worker.id)
    this.setState({ workers: updatedWorkers })
    evt.staff = updatedWorkers
    this.props.handleUpdate(evt)
  }

  getActiveEmployees = async() => {
    const allEmployees = await employee.getAll()
    const employees = allEmployees.filter(employee => employee['active?'])
    this.setState({ employees })
  }

  iconSize = () => {
    const { mobile } = this.props
    if (mobile) {
      return '2x'
    } else {
      return '3x'
    }
  }

  view = () => {
    const { editMode } = this.props
    if (editMode) {
      return (
        <Edit
          {...this.props}
          workers={this.state.workers}
          chooseWorker={this.chooseWorker}
          addWorker={this.addWorker}
          removeWorker={this.removeWorker}
          iconSize={this.iconSize()}
        />
      )
    } else if (this.state.workers) {
      return (
        <View
          {...this.props}
          workers={this.state.workers}
          iconSize={this.iconSize()}
        />
      )
    } else {
      return (
        <div className="Staff--container">
          <label>Staff</label>
          <div className="Staff--none">
            <p>No one has been scheduled</p>
            <p>to work this event...</p>
          </div>
        </div>
      )
    }
  }

  render(){
    return (
      <div className="BasicInfo--component">
        <h3 className="BasicInfo--component-title">Staff</h3>
          {this.view()}
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={this.closeModal}
          parentSelector={this.getParent}
          overlayClassName="Staff--modal-overlay"
          className="Staff--modal"
        >
          <div className="Staff--modal-content">
            <StaffSelector
              workers={this.state.workers}
              employees={this.state.employees}
              handleEmployeeSelect={this.handleEmployeeSelect}
            />

            <button onClick={this.closeModal}>
              Close
            </button>
          </div>

        </Modal>
      </div>
    )
  }
}
