import React, { Component } from 'react'
import List from '../List/'
import NavSection from '../NavSection'
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

  styleList = () => {
    const { data } = this.props
    if (data && data.length) {
      return {}
    } else {
      return { justifyContent: 'center', height: 'calc(100vh - 155px)'}
    }
  }

  render(){
    const { view, mainHeader, data, count, mobile } = this.props
    const singular = view? view.split('').splice(0, view.length - 1).join('') : null

    return (
      <div className='ListPage'>

        {
          !mobile?
          <aside>
            <NavSection {...this.props}/>
          </aside>
          :
          null
        }

        <main>
          <div
            className="ListPage--category-title-container"
          >
            <h3 className="ListPage--category-title">{mainHeader}</h3>
          </div>

          <div className="ListPage--list" style={this.styleList()}>
            <List
              {...this.props}
              title={mainHeader}
              items={data}
            />
          </div>

          <div className="ListPage--end-message">
            {
              count?
              <h4>{`${count} ${count > 1? view : singular}`}</h4>
              :
              null
            }
          </div>
        </main>

      </div>
    )
  }
}
