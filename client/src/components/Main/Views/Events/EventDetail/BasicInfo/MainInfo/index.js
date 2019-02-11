import React, { Component } from 'react'
import Standard from './Standard'
import StandardMobile from './StandardMobile';
import Edit from './Edit'
import EditMobile from './EditMobile'
import './index.css'

export default class MainInfo extends Component {
  constructor(props){
    super(props)
    this.state = {
      mobile: false
    }
  }

  updateView = (e) => {
    const width = window.innerWidth;
    if (width < 750) {
      this.setState({ mobile: true })
    } else {
      this.setState({ mobile: false })
    }
  }

  componentDidMount() {
    this.updateView();
    window.addEventListener("resize", this.updateView);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateView);
  }

  view = () => {
    const { editMode } = this.props
    const { mobile } = this.state
    if (editMode) {
      if (mobile) {
        return (
          <EditMobile
          {...this.props}
          />
        )
      } else {
        return (
          <Edit
          {...this.props}
          />
        )
      }
    } else {
      if (mobile) {
        return (
          <StandardMobile
            {...this.props}
          />
        )
      } else {
        return (
          <Standard
            {...this.props}
          />
        )
      }
    }
  }

  render(){
    return this.view()
  }
}
