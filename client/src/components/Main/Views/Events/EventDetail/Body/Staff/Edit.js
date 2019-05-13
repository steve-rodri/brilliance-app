import React, { Component } from 'react'
import { pencilIcon, plusIcon, minusIcon } from '../../../../../../../helpers/icons'

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

  styleContainer = () => {
    const { workers } = this.props
    const style = {}

    if (workers && workers.length) {
      style.alignSelf = 'start'
    } else {
      style.alignSelf = 'center'
    }

    return style
  }

  showInput = () => {
    this.setState({
      showInput: true
    })
  }

  render(){
    const { mobile, workers, iconSize } = this.props
    return (
      <div className="Staff--container Staff--Edit" style={this.styleContainer()}>
      {mobile? <label>Staff</label> : null}
        <table className="Staff Staff--Edit">
          <tbody>
          {workers?
            workers.map( (worker, i) =>
              <tr className="Staff--worker Staff--Edit" key={i} style={this.styleRow()}>
                <td className="Staff--worker-name Staff--Edit">{worker.info.contact.fullName}</td>
              </tr>
            )
            :
            null
          }
          {
            workers && workers.length?
            <tr className="Staff--worker Staff--Edit" style={this.styleRow()}>
              <td
                className="Staff--edit-workers Staff--Edit"
                onClick={this.props.chooseWorker}
              >
                <div className="Staff--pencil-icon">{pencilIcon(iconSize)}</div>
                <h3 style={{fontWeight: 700}}>Edit</h3>
              </td>
            </tr>
            :
            <tr className="Staff--worker Staff--Edit" style={this.styleRow()}>
              <td className="Staff--add-worker Staff--Edit" onClick={this.props.chooseWorker}>
                <div className="Staff--plus-icon">{plusIcon(iconSize)}</div>
                <h3 style={{fontWeight: 700}}>NEW WORKER</h3>
              </td>
            </tr>
          }
          </tbody>
        </table>
      </div>
    )
  }
}
