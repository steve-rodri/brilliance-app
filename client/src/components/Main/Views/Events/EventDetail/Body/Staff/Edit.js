import React, { Component, Fragment } from 'react'
import StaffSelector from './StaffSelector'

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
    const { mobile } = this.props
    return (
      <div className="Staff--container Staff--Edit" style={this.styleContainer()}>
        {
          mobile?
          <Fragment>
            <label>Staff</label>
            <div className="Staff--choose-workers" onClick={this.props.chooseWorker}>
              <p style={{fontWeight: 700}}>Choose Workers</p>
            </div>
          </Fragment>
          :
          <StaffSelector {...this.props}/>
        }
      </div>
    )
  }
}



// {
//   workers && workers.length?
//   <div className="Staff Staff--Edit" onClick={this.props.chooseWorker}>
//     {workers?
//       workers.map( (worker, i) =>
//         <div className="Staff--worker Staff--Edit" key={i} style={this.styleRow()}>
//           <div className="Staff--worker-name Staff--Edit"><p>{worker.info.contact.fullName}</p></div>
//         </div>
//       )
//       :
//       null
//     }
//   </div>
//   :
//   <div className="Staff--add-worker Staff--Edit" onClick={this.props.chooseWorker}>
//     <div className="Staff--plus-icon">{plusIcon()}</div>
//     <p style={{fontWeight: 700}}>ADD</p>
//   </div>
// }
