import React, { Component } from 'react'
import './index.css'

export default class StaffSelector extends Component {

  style = (employee) => {
    const { workers, employee_ids, mobile } = this.props
    const style = {}
    if (
        (workers && workers.find(worker => worker.info.id === employee.id))
        ||
        (employee_ids && employee_ids.find(id => id === employee.id))
      ) {

      style.backgroundColor = 'limegreen'
      style.border = '2px solid limegreen'
      style.color = 'white'
      style.fontWeight = 'bold'

    } else {
      style.border = '2px dashed var(--light-gray)'
      if (!mobile) {
        style.border = '1px solid #bbb'
        style.backgroundColor = 'var(--white)'
      }
    }
    return style
  }

  render(){
    const { mobile, close, employees, handleEmployeeSelect } = this.props
    let labor, nonLabor;
    if (employees) {
      labor = employees.filter(employee => employee.labor)
      nonLabor = employees.filter(employee => !employee.labor)
    }
    return (
      <div className="StaffSelector">
        {
          mobile?
          <div className="StaffSelector--header">
            <h2>Choose Workers</h2>
          </div>
          :
          null
        }
        <main>
          {employees && labor? <label style={{justifySelf: 'start'}}>Labor</label> : null}
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
          {employees && nonLabor? <label style={{justifySelf: 'start'}}>Non-Labor</label> : null}
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
        {
          mobile && typeof close === 'function'?
          <footer>
            <button
              className="StaffSelector--done EventDetail-Body--button"
              onClick={close}
            >
              DONE
            </button>
          </footer>
          :
          null
        }
      </div>
    )
  }
}
