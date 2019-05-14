import React, { Component, Fragment } from 'react'
import SearchField from '../../../../../SearchField/'
import SearchResult from './SearchResult/'
import { item } from '../../../../../../services/BEP_APIcalls.js'
import axios from 'axios'
import './index.css'

export default class ItemSelector extends Component {
  constructor(props){
    super(props)
    this.state = {
      search: '',
      items: []
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: false
    }
  }

  componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  handleChange = async(name, value) => {
    this.setState({ [name]: value })
    const items = await this.findItems(value)
    if (items) {
      this.setState({ items })
    }
  }

  findItems = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const items = await item.find(query, this.ajaxOptions)
      return items
    }
  }

  selectItem = (e, name, i) => {
    e.stopPropagation()
    const { items } = this.state
    const item = items[i]
    this.props.addItem(item)
  }

  styleSearch = () => {
    const { search } = this.state
    if (search.length > 2) {
      return { alignSelf: 'start'}
    } else {
      return {}
    }
  }

  formatResult = (item) => {
    return (
      <SearchResult
        {...this.props}
        key={item.id}
        item={item}
      />
    )
  }

  view = () => {
    const { view } = this.state;
    switch (view) {
      default:
      return (
        <Fragment>
          <h3>Add Item</h3>
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
            searchResults={this.state.items}
            onEnter={this.selectItem}
            onSelect={this.selectItem}
          />

          <div className="ItemSelector--create-group-button">
            <h2 className="ItemSelector--button-text">Create Group/Package</h2>
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
