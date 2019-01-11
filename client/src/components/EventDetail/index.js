import React, { Component } from 'react';
import BasicInfo from './BasicInfo/index.js';
import Logistics from './Logistics';
import Invoice from './Invoice';
import CashFlow from './CashFlow';
import './index.css'

export default class EventDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: 'Basic Info'
    }
  }

  setView = (view) => {
    this.setState({ view })
  }

  view = () => {
    const { event } = this.props
    switch (this.state.view) {
      case 'Basic Info':
        return (
          <BasicInfo
            event={event}
          />
        )
      case 'Logistics':
        return (
          <Logistics
            event={event}
          />
        )
      case 'Invoice':
        return (
          <Invoice
            event={event}
          />
        )
      case 'Cash Flow':
        return (
          <CashFlow
            event={event}
          />
        )

      default:
    }
  }

  styleTab = (view) => {
    if (view === this.state.view) {
      return this.highlight()
    } else {
      return {}
    }
  }

  highlight = () => {
    return {
      backgroundColor: 'white',
      color: 'rgba(0,0,0,.88)',
      borderTop:'1px solid rgba(0,0,0,.88) '
    }
  }

  render(){
    return (
      <div>
        <div className="EventDetail--tab-control">
          <div className="Tab" style={this.styleTab("Basic Info")}  onClick={() => this.setView("Basic Info")}><h3>Basic Info</h3></div>
          <div className="Tab" style={this.styleTab("Logistics")}   onClick={() => this.setView("Logistics")}><h3>Logistics</h3></div>
          <div className="Tab" style={this.styleTab("Invoice")}    onClick={() => this.setView("Invoice")}><h3>Invoice</h3></div>
          <div className="Tab" style={this.styleTab("Cash Flow")}   onClick={() => this.setView("Cash Flow")}><h3>Cash Flow</h3></div>
        </div>
        {this.view()}
      </div>
    )
  }
}
