import React, { Component } from 'react'
import './index.css'

export default class StaffSelector extends Component {

  style = (employee) => {
    const { workers, employee_ids } = this.props
    if (
        (workers && workers.find(worker => worker.info.id === employee.id))
        ||
        (employee_ids && employee_ids.find(id => id === employee.id))
      ) {
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
    const { close, employees, handleEmployeeSelect } = this.props
    const labor = employees.filter(employee => employee.labor)
    const nonLabor = employees.filter(employee => !employee.labor)
    return (
      <div className="StaffSelector">
        <div className="StaffSelector--header">
          <h2>Choose Workers</h2>
        </div>
        <main>
          <label style={{justifySelf: 'start'}}>Labor</label>
          <div className="StaffSelector--labor">
            {employees && labor.map(employee =>
              <div
                className="StaffSelector--employee"
                key={employee.id}
                style={this.style(employee)}
                onClick={(e) => {
                  e.stopPropagation()
                  handleEmployeeSelect(employee)
                }}
              >
                <p>{employee.contactInfo.fullName}</p>
              </div>
            )}
          </div>
          <label style={{justifySelf: 'start'}}>Non-Labor</label>
          <div className="StaffSelector--non-labor">
            {employees && nonLabor.map(employee =>
              <div
                className="StaffSelector--employee"
                key={employee.id}
                style={this.style(employee)}
                onClick={(e) => {
                  e.stopPropagation()
                  handleEmployeeSelect(employee)
                }}
              >
                <p>{employee.contactInfo.fullName}</p>
              </div>
            )}
          </div>
        </main>
        <footer>
          <button
            className="StaffSelector--done EventDetail-Body--button"
            onClick={close}
          >
            DONE
          </button>
        </footer>
      </div>
    )
  }
}
