import React, { Component } from 'react'
import SearchField from '../../../../../SearchField/'
import SearchResult from './SearchResult/'
import { item } from '../../../../../../services/item'
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
      const items = await item.find(query, this.axiosRequestSource.token)
      return items
    }
  }

  styleSearch = () => {
    // const { search } = this.state
    // if (search.length > 2) {
      return { alignSelf: 'start'}
  //   } else {
  //     return {}
  //   }
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

  render(){
    return (
      <div className="ItemSelector">
        <h1>Add Item</h1>
        <SearchField
          formClassName="ItemSelector--search"
          resultsClassName="ItemSelector--search-results"
          resultClassName="ItemSelector--search-result"
          formatResult={this.formatResult}
          styleForm={this.styleSearch()}
          input={{
            className: 'Input',
            name: 'search',
            placeholder:'search',
            value: this.state.search
          }}
          handleChange={this.handleChange}
          searchResults={this.state.items}
          onEnter
          onSelect
        />

        <div className="AddNew">
          <span className="AddNew--button-text">Create Group/Package</span>
        </div>

      </div>
    )
  }
}
