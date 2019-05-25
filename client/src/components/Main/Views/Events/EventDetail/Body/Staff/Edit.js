import React, { Component } from 'react'
import { plusIcon } from '../../../../../../../helpers/icons'

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
    const { mobile, workers } = this.props
    return (
      <div className="Staff--container Staff--Edit" style={this.styleContainer()}>
      {mobile? <label>Staff</label> : null}
      {
        workers && workers.length?
        <table className="Staff Staff--Edit" onClick={this.props.chooseWorker}>
          <tbody>
          {workers?
            workers.map( (worker, i) =>
              <tr className="Staff--worker Staff--Edit" key={i} style={this.styleRow()}>
                <td className="Staff--worker-name Staff--Edit"><h3>{worker.info.contact.fullName}</h3></td>
              </tr>
            )
            :
            null
          }
          </tbody>
        </table>
        :
        <div className="Staff--add-worker Staff--Edit" onClick={this.props.chooseWorker}>
          <div className="Staff--plus-icon">{plusIcon()}</div>
          <p style={{fontWeight: 700}}>ADD</p>
        </div>
      }
      </div>
    )
  }
}
