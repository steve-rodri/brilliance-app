import React, { Component } from 'react'
import Calendar from '../Calendar'
import Search from '../Search/'
import AddNew from '../Buttons/AddNew'
import './index.css'

export default class NavSection extends Component {

  styleActiveMenu = (category) => {
    if (this.props.category === category) {
      return (
        {
          color: 'var(--turquoise)',
        }
      )
    } else {
      return {}
    }
  }

  render (){
    const {
      mobile,
      title,
      view,
      categories,
      date,
      isDay,
      match,
      history,
      refresh,
      changeNav,
      onDateChange
    } = this.props
    const singular = view? view.split('').splice(0, view.length - 1).join('') : null

    return (
      <div className="NavSection">
        {/* Title */}
        {
          !mobile?
          <h1
            className="NavSection--name"
            onClick={(e) => {
              e.stopPropagation()
              if (refresh) {
                refresh(true, match.path)
              }
            }}
          >
            {title? title : view}
          </h1>
          :
          null
        }

        {/* Search */}
        <Search
          {...this.props}
          className="NavSection--search"
          subject={title? title : view}
          url={match.path}
        />

        {/* Calendar */}
        {
          view === "Events" || view === "Invoices"?
          <Calendar
            className="NavSection--calendar"
            date={isDay && date? new Date(date.start) : new Date()}
            onDateChanged={onDateChange}
            changeNav={changeNav}
          />
          :
          null
        }

        {/* Categories */}
        {
          !mobile?
          <div className="NavSection--categories-container">
            {/* <div className="Arrow Arrow-Left" style={{gridColumn: '1 / span 1'}}></div> */}
            <div className="NavSection--categories">
              {categories && categories.map((category, id) => (
              <p
                style={this.styleActiveMenu(category)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (this.props.category === category) {
                    history.push(`${match.path}`)
                  } else {;
                    history.push(`${match.path}?category=${category}`)  
                  }
                }}
                key={id}>{category}
              </p>
              ))}
            </div>
            {/* <div className="Arrow Arrow-Right" style={{gridColumn: '3 / span 1'}}></div> */}
          </div>
          :
          null
        }

        {/* Add New Button */}
        {view === "Events" || view === "Clients" || view === "Workers"?
          <AddNew
            linkPath={{pathname: `${match.path}/new`, state: { modal: true } }}
            className="NavSection--button"
            type={singular}
          />
          :
          null
        }
      </div>
    )
  }
}