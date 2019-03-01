import React, { Component } from 'react'
import Header from './Header/index.js'
import About from './About/index.js'
import Times from './Times/index.js'
import Notes from './Notes/index.js'
import Staff from './Staff/index.js'
import Buttons from './Buttons'
import './index.css'

export default class BasicInfo extends Component {
  render(){
    const { mobile } = this.props
    return (
      <div className="BasicInfo--container">

        <Header {...this.props} />

        <div className="BasicInfo--components">
          <About {...this.props} />
          <Staff {...this.props} />
          {
            mobile?
            null
            :
            <Times {...this.props}/>
          }
          <Notes {...this.props} />
        </div>

        {this.props.mobile?
          <Buttons {...this.props}/>
          :
          null
        }
      </div>
    )
  }
}
