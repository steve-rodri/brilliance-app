import React, { Component } from 'react'
import { deleteIcon, addIcon } from '../../../../../../../helpers/icons'

export default class Edit extends Component {
  constructor(props){
    super(props)
    this.state = {
      showInput: false
    }
  }

  styleRow = () => {
    return (
      {
        backgroundColor: '#F8F8F8'
      }
    )
  }

  showInput = () => {
    this.setState({
      showInput: true
    })
  }

  render(){
    const { mobile, workers, iconSize } = this.props
    return (
      <div className="Staff--container Staff--Edit">
      {mobile? <label>Staff</label> : null}
        <table className="Staff Staff--Edit">
          <tbody>
          {workers?
            workers.map( (worker, i) =>
              <tr className="Staff--worker Staff--Edit" key={i} style={this.styleRow()}>
                <td className="Staff--icon Staff--Edit"><div onClick={() => this.props.removeWorker(worker)}>{deleteIcon(iconSize)}</div></td>
                <td className="Staff--worker-name Staff--Edit">{worker.info.contact.fullName}</td>
              </tr>
            )
            :
            null
          }
          <tr className="Staff--worker Staff--Edit" style={this.styleRow()}>
            <td className="Staff--icon Staff--Edit"><div onClick={this.props.chooseWorker}>{addIcon(iconSize)}</div></td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
