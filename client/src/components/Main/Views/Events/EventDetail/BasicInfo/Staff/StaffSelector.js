import React, { Component } from 'react'
import './StaffSelector.css'

export default class StaffSelector extends Component {

  style = (employee) => {
    const { workers } = this.props
    if (workers && workers.find(worker => worker.info.id === employee.id)) {
      return {
        backgroundColor: 'limegreen',
        border: '2px solid limegreen',
        color: 'white',
        fontWeight: 'bold'
      }
    } else {
      return {
        border:'2px dashed var(--light-gray)'
      }
    }
  }

  render(){
    const { employees, handleEmployeeSelect } = this.props
    const labor = employees.filter(employee => employee["labor?"])
    const nonLabor = employees.filter(employee => !employee["labor?"])
    return (
      <div className="StaffSelector">
        <label>Labor</label>
        <div className="StaffSelector--labor">
          {employees && labor.map(employee =>
            <button
              className="StaffSelector--employee"
              key={employee.id}
              style={this.style(employee)}
              onClick={(e) => {
                e.stopPropagation()
                handleEmployeeSelect(employee)
              }}
            >
              <p>{employee.contact.fullName}</p>
            </button>
          )}
        </div>
        <label>Non-Labor</label>
        <div className="StaffSelector--non-labor">
          {employees && nonLabor.map(employee =>
            <button
              className="StaffSelector--employee"
              key={employee.id}
              style={this.style(employee)}
              onClick={(e) => {
                e.stopPropagation()
                handleEmployeeSelect(employee)
              }}
            >
              <p>{employee.contact.fullName}</p>
            </button>
          )}
        </div>
      </div>
    )
  }
}
