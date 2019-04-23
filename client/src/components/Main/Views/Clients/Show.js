import React, { Component } from 'react';
import { clientName, clientInfo } from '../../../../helpers/clientHelpers'

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
    const { match, history } = this.props
    history.push(`/admin/events?client=${match.params.id}`)
  }

  handleGetClientInvoices = () => {
    const { match, history } = this.props
    history.push(`/admin/invoices?client=${match.params.id}`)
  }

  render(){
    const { client } = this.state
    const name = clientName(client)
    const contactInfo = clientInfo(client)

    return (
      <div className="Client-Modal--Content">
        <h2 className="Client-Modal--Title">{name}</h2>
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
