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


  linkPath = () => {
    const { user: { accessLevel }, view } = this.props
    let path = { state: { modal: true } }
    let updatedView = view.toLowerCase();

    if (view === 'Workers') updatedView = 'staff'
    path.pathname = `/${accessLevel}/${updatedView}/new`

    return path;
  }

  render (){
    const {
      mobile,
      title,
      view,
      singularView: singular,
      categories,
      date,
      isDay,
      match,
      history,
      refresh,
      changeNav,
      onDateChange
    } = this.props
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
        />

        {/* Calendar */}
        {
          view === "Events" || view === "Invoices"?
          <div className="NavSection--calendar">
            <Calendar
              {...this.props}
              date={isDay && date? new Date(date.start) : new Date()}
              onDateChanged={onDateChange}
              changeNav={changeNav}
            />
          </div>
          :
          null
        }

        {/* Categories */}
        {
          !mobile && view !== 'Workers'?
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
                  } else {
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
            linkPath={this.linkPath()}
            className="NavSection--button"
            type={singular()}
          />
          :
          null
        }
      </div>
    )
  }
}
