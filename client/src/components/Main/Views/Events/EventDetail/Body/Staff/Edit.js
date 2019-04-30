import React, { Component } from 'react'
import { plusIcon, minusIcon } from '../../../../../../../helpers/icons'

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
                <td style={{backgroundColor: 'red', color: 'white'}} className="Staff--icon Staff--Edit" onClick={() => this.props.removeWorker(worker)}><div>{minusIcon(iconSize)}</div></td>
                <td className="Staff--worker-name Staff--Edit">{worker.info.contact.fullName}</td>
              </tr>
            )
            :
            null
          }
          <tr className="Staff--worker Staff--Edit" style={this.styleRow()}>
            <td style={{backgroundColor: 'limegreen', color: 'white'}} className="Staff--icon Staff--Edit" onClick={this.props.chooseWorker}><div>{plusIcon(iconSize)}</div></td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
