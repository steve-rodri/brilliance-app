import React, { Component, Fragment } from 'react'
import SearchField from '../../../../../SearchField/'
import SearchResult from './SearchResult/'
import { line, inventory } from '../../../../../../services/BEP_APIcalls.js'
import axios from 'axios'
import './index.css'

export default class ItemSelector extends Component {
  constructor(props){
    super(props)
    this.state = {
      search: ''
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: false,
    }
  }

  componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  componentDidMount(){
    this.setClient()
  }

  setClient = () => {
    const { inv } = this.props
    if (inv && inv.event && inv.event.client) {
      this.ajaxOptions.clientId = inv.event.client.id
    }
  }

  handleChange = async(name, value) => {
    this.setState({ [name]: value })
    const lines = await this.findLines(value)
    const inventory = await this.findInventories(value)

    this.setState(prevState => {
      if (prevState.searchResults) {
        const prevLines = prevState.searchResults["past invoices"]
        const prevStock = prevState.searchResults.inventories
        if (lines !== prevLines && inventory !== prevStock) {
          return {
            searchResults: {
              ...prevState.searchResults,
              "past invoices": lines,
              inventory
            }
          }
        }
        if (lines !== prevLines) {
          return {
            searchResults: {
              ...prevState.searchResults,
              "past invoices": lines
            }
          }
        }
        if (inventory !== prevStock) {
          return {
            searchResults: {
              ...prevState.searchResults,
              inventory
            }
          }
        }
      }
      return {
        searchResults: {
          "past invoices": lines,
          inventory
        }
      }
    })
  }

  findLines = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const lines = await line.find(query, this.ajaxOptions)
      return lines
    }
  }

  findInventories = async(query) => {
    // const q = query.split('')
    // if (q.length > 2) {
      const inventories = await inventory.find(query, this.ajaxOptions)
      return inventories
    // }
  }

  handleSelect = (e, name, i, key) => {
    e.stopPropagation()
    const { searchResults } = this.state
    const item = searchResults[key][i]
    this.props.addItem(item, key)
  }

  styleSearch = () => {
    const { search } = this.state
    if (search.length > 2) {
      return { alignSelf: 'start'}
    } else {
      return {}
    }
  }

  formatResult = (result, type) => {
    return (
      <SearchResult
        {...this.props}
        key={result.id}
        result={result}
        type={type}
      />
    )
  }

  view = () => {
    const { view } = this.state;
    switch (view) {
      default:
      return (
        <Fragment>
          <div className="ItemSelector--title"><h2>Add Item</h2></div>
          <SearchField
            formClassName="ItemSelector--search"
            resultsClassName="ItemSelector--search-results"
            resultClassName="ItemSelector--search-result"
            formatResult={this.formatResult}
            styleForm={this.styleSearch()}
            input={{
              className: 'Input',
              name: 'search',
              placeholder:'search...',
              value: this.state.search
            }}
            handleChange={this.handleChange}
            searchResults={this.state.searchResults}
            onEnter={this.handleSelect}
            onSelect={this.handleSelect}
          />

          <div className="ItemSelector--buttons">
            <div className="ItemSelector--button">
              <h2 className="ItemSelector--button-text">Create Group/Package</h2>
            </div>

            {/* <div className="ItemSelector--button">
              <h2 className="ItemSelector--button-text">Create New Item</h2>
            </div> */}
          </div>
        </Fragment>
      )
    }
  }

  render(){
    return (
      <div className="ItemSelector">
        {this.view()}
      </div>
    )
  }
}
