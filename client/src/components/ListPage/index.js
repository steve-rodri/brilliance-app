import React, { Component } from 'react'
import Modal from 'react-modal';
import { Redirect } from 'react-router-dom'
import List from '../List/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListPage.css'

library.add(faPlus)
Modal.setAppElement('#root');

export default class ListPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToCreateNew: false,
      showModal: false
    }
  }

  handleOpenModal = () => {
    this.setState({ showModal: true })
  }

  handleCloseModal = () => {
    this.setState({ showModal: false })
  }


  createNew = (title) => {
    switch (title) {
      case "Clients":
        this.handleOpenModal();
        break;
      default:
        this.setState({
          redirectToCreateNew: true
        })
        break;
    }
  }

  styleActiveMenu = (category) => {
    if (this.props.category === category) {
      return {
          color: 'white',
          borderLeft: '1px solid var(--light-gray)',
          borderRight: '1px solid var(--light-gray)'
        }
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
    const { match, category, title } = this.props
    if (this.state.redirectToCreateNew) return (<Redirect to={`${match.path}/new`}/>)
    return (
      <div className='ListPage--container'>
        <aside>

          {/* Title */}
          <h2
            className="ListPage--name"
            onClick={(e) => {
              e.stopPropagation()
              this.props.fetchByCategory('All')
            }}
          >
            {title}
          </h2>

          {/* Categories */}
          <div className="ListPage--categories">
            {this.props.categories.map((category, id) => (
              <div
                style={this.styleActiveMenu(category)}
                onClick={(e) => {
                  e.stopPropagation()
                  this.props.fetchByCategory(category)
                }}
                key={id}>{category}
              </div>
            ))}
          </div>

          {/* Add New Button */}
          {title === "Events" || title === "Clients"?
            <div
              className="ListPage--button create"
              onClick={() => this.createNew(title)}
            >
              <span className="button-text">Add New</span>
              {<FontAwesomeIcon className="button-icon" icon="plus" size="2x"/>}
            </div>
            :
            ''
          }
        </aside>

        <main>

          <h3 className="ListPage--category-title" style={this.styleSubTitle()}>{category}</h3>
          <List
            subtitles={this.props.subtitles}
            items={this.props.data}
            type={this.props.title}
            create={this.createNew}
            load={this.props.load}
            hasMore={this.props.hasMore}
            handleSelect={this.handleSelect}
          />

        </main>

        <Modal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          className="ListPage--modal"
          overlayClassName="ListPage--modal-overlay"
        >

        </Modal>

      </div>
    )
  }
}
