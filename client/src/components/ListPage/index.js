import React, { Component } from 'react'
import List from '../List/index.js'
import Search from '../Search/index.js'
import AddNew from '../Buttons/AddNew'
import './ListPage.css'

export default class ListPage extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    this.showModal(this.props)
  }

  showModal = (props) => {
    const { match, showModal } = props
    if (match) {
      if (match.params) {
        if (match.params.id) {
          if (showModal) {
            showModal()
          }
        }
      }
    }
  }

  styleActiveMenu = (category) => {
    if (this.props.category === category) {
      return (
        {
          color: 'white',
          borderLeft: '1px solid var(--light-gray)',
          borderRight: '1px solid var(--light-gray)'
        }
      )
    } else {
      return {}
    }
  }

  styleSubTitle = () => {
    if (this.props.category === 'All') {
      return { display: 'none'}
    } else {
      return {}
    }
  }

  render(){
    const {
      title,
      type,
      category,
      categories,
      data,
      match,
      refresh
    } = this.props

    return (
      <div className='ListPage--container'>
        <aside>

          {/* Title */}
          <h2
            className="ListPage--name"
            onClick={(e) => {
              e.stopPropagation()
              refresh(true, match.path)
            }}
          >
            {title}
          </h2>

          {/* Search */}
          <Search
            subject={title}
            url={match.path}
            refresh={refresh}
          />

          {/* Categories */}
          <div className="ListPage--categories">
            {categories && categories.map((category, id) => (
              <div
                style={this.styleActiveMenu(category)}
                onClick={(e) => {
                  e.stopPropagation()
                  refresh(true, `${match.path}?category=${category}`);
                }}
                key={id}>{category}
              </div>
            ))}
          </div>

          {/* Add New Button */}
          {type === "Events" || type === "Clients"?
            <AddNew
              linkPath={{pathname: `${match.path}/new`, state: { modal: true } }}
            />
            :
            null
          }

        </aside>

        <main>

          <div className="ListPage--category-title-container" style={this.styleSubTitle()}><h3 className="ListPage--category-title">{category}</h3></div>
          <List
            {...this.props}
            title={category}
            items={data}
          />

        </main>

      </div>
    )
  }
}
