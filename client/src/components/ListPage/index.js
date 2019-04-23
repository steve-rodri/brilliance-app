import React, { Component } from 'react'
import List from '../List/'
import Calendar from '../Calendar'
import Search from '../Search/'
import AddNew from '../Buttons/AddNew'
import './index.css'

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
          borderColor: 'var(--light-gray)'
        }
      )
    } else {
      return {}
    }
  }

  styleSubTitle = () => {
    const { category } = this.props
    if (category && category !== 'All') {
      return {}
    } else {
      return { display: 'none'}
    }
  }

  styleList = () => {
    const { data } = this.props
    if (data && data.length) {
      return {}
    } else {
      return { justifyContent: 'center'}
    }
  }

  render(){
    const {
      title,
      type,
      category,
      categories,
      data,
      date,
      match,
      refresh,
      handleDateChange
    } = this.props
    return (
      <div className='ListPage'>
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
          {
            <div className="ListPage--categories-container">
              {/* <div className="Arrow Arrow-Left" style={{gridColumn: '1 / span 1'}}></div> */}
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
              {/* <div className="Arrow Arrow-Right" style={{gridColumn: '3 / span 1'}}></div> */}
            </div>
          }

          {/* Calendar */}
          {
            type === "Events" || type === "Invoices"?
            <Calendar
              date = {date && date.start && new Date(date.start)}
              onDateChanged={handleDateChange}
            />
            :
            null
          }

          {/* Add New Button */}
          {type === "Events" || type === "Clients" || type === "Staff"?
            <AddNew
              linkPath={{pathname: `${match.path}/new`, state: { modal: true } }}
              style={{gridRow: '5 / span 1'}}
            />
            :
            null
          }
        </aside>

        <main>
          <div
            className="ListPage--category-title-container"
            style={this.styleSubTitle()}
          >
            <h3 className="ListPage--category-title">{category}</h3>
          </div>

          <div className="ListPage--list" style={this.styleList()}>
            <List
              {...this.props}
              title={category}
              items={data}
            />
          </div>

          <div className="ListPage--end-message">

            <h4>{`Found ${data && data.length} ${type}`}</h4>

          </div>
        </main>
      </div>
    )
  }
}
