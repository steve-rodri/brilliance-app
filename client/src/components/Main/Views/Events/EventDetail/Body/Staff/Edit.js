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

  showInput = () => {
    this.setState({
      showInput: true
    })
  }

  render(){
    const { mobile } = this.props
    return (
      <Fragment>
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
      </Fragment>
    )
  }
}
