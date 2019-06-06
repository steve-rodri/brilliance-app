import React, { Component } from 'react';
import { clientDisplay, clientInfo } from '../../../../helpers/clientHelpers'

export default class Show extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  async componentDidMount(){
    const { clt } = this.props
    const client = await clt()
    this.setState({ client })
  }

  handleGetClientEvents = () => {
    const { match, history, user: { accessLevel } } = this.props
    history.push(`/${accessLevel}/events?client=${match.params.id}`)
  }

  handleGetClientInvoices = () => {
    const { match, history, user: { accessLevel } } = this.props
    history.push(`/${accessLevel}/invoices?client=${match.params.id}`)
  }

  render(){
    const { client } = this.state
    const name = clientDisplay(client)
    const contactInfo = clientInfo(client)

    return (
      <div className="Client-Modal--Content">
        <div className="Client-Modal--Title">{name}</div>
        <div className="Client-Modal--Fields">
          <label className="Client-Modal--Label">Phone</label>
            <div className="Client-Modal--Field">
              <a href={`tel:${contactInfo && contactInfo.phoneNumber}`}>{contactInfo && contactInfo.phoneNumber? contactInfo.phoneNumber : ''}</a>
            </div>
          <label className="Client-Modal--Label">Email</label>
            <div className="Client-Modal--Field">
              <a href={`mailto:${contactInfo && contactInfo.emailAddresses && contactInfo.emailAddresses[0]}`}>{contactInfo && contactInfo.emailAddresses? contactInfo.emailAddresses[0] : ''}</a>
            </div>
        </div>

        <div className="Client-Modal--Buttons">
          <button
            className="Client-Modal--Button"
            onClick={(e) => {
              e.stopPropagation()
              this.handleGetClientInvoices()
            }}
          >
            Invoices
          </button>
          <button
            className="Client-Modal--Button"
            onClick={(e) => {
              e.stopPropagation()
              this.handleGetClientEvents()
            }}
          >
            Events
          </button>
        </div>
      </div>
    )
  }
}
