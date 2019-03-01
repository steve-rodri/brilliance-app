import React, { Component } from 'react'
import Edit from './Edit'
import View from './View'
import { employee } from '../../../../../../../services/employee'
import './index.css'

export default class Staff extends Component {
  constructor(props){
    super(props)
    this.state = {
      workers: null,
      workerField: '',
      searchResults: null
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
        this.setState({
          workers: evt.staff
        })
      }
    }
  }

  addWorker = () => {
    const workers = [...this.state.workers]
    workers.push( { isNew: true } )
    this.setState({ workers })
  }

  removeWorker = (index) => {
    const workers = [...this.state.workers]
    workers.splice(index, 1)
    this.setState({ workers })
  }

  handleWorkerSearchChange = async(name, value) => {
    this.setState({ workerField: value })
    const employees = await this.findEmployees(value)
    if (!value || !employees || employees.length < 0) {
      // this.setState(prevState => ({
      //   formData: {
      //     ...prevState.formData,
      //     client_id: null
      //   }
      // }))
    }

    this.setState({ searchResults: employees })
  }

  findEmployees = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const employees = await employee.find(query)
      return employees
    }
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
          handleWorkerSearchChange={this.handleWorkerSearchChange}
          workerField={this.state.workerField}
          searchResults={this.state.searchResults}
          addWorker={this.addWorker}
          removeWorker={this.removeWorker}
          workers={this.state.workers}
          iconSize={this.iconSize()}
        />
      )
    } else {
      return (
        <View
          {...this.props}
          workers={this.state.workers}
          iconSize={this.iconSize()}
        />
      )
    }
  }

  render(){
    return (
      <div className="BasicInfo--component">
        <h3 className="BasicInfo--component-title">Staff</h3>
          {this.view()}
      </div>
    )
  }
}
