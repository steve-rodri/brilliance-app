import React, { Component } from 'react'
import Header from './Header/index.js'
import About from './About/index.js'
import Logistics from './Logistics/index.js'
import Notes from './Notes/index.js'
import Staff from './Staff/index.js'
import Buttons from '../../../../../Buttons/Buttons'
import { date, time } from '../../../../../Helpers/datetime'
import './index.css'

export default class BasicInfo extends Component {
  constructor(props){
    super(props)
    this.container = React.createRef()
  }

  scrollToTop = () => {
    this.container.current.scrollTop = 0
  }

  render(){
    const { mobile, editMode, fields } = this.props;
    const about = fields && (fields.client || fields.location || date(fields) || time(fields));
    return (
      <div className="BasicInfo--container" ref={this.container}>


        {
          mobile && editMode?
          null
          :
          <Header {...this.props} />
        }

        <div className="BasicInfo--components-container">
          <div className="BasicInfo--components">

            {
              about?
              <About {...this.props} />
              :
              null
            }

            {
              about?
              <Staff {...this.props}/>
              :
              null
            }

            {
              mobile?
              null
              :
              <Logistics {...this.props}/>
            }

            <Notes {...this.props} />

          </div>
        </div>


        {this.props.mobile?
          <Buttons {...this.props} scrollToTop={this.scrollToTop}/>
          :
          null
        }
      </div>
    )
  }
}
