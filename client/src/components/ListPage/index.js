import React, { Component } from 'react'
import List from '../List/'
import AddNew from '../Buttons/AddNew'
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
    const { data, mobile } = this.props
    if (data && data.length) {
      return {}
    } else if (mobile) {
      return { justifyContent: 'center', height: 'calc(100vh - 195px - var(--mobile-adj))'}
    } else {
      return { justifyContent: 'center', height: 'calc(100vh - 155px)'}
    }
  }

  styleMain = () => {
    const { data } = this.props
    if (data && data.length) {
      return {}
    } else {
      return {
        gridTemplateRows: "40px 1fr auto"
      }
    }
  }

  render(){
    const {
      user: { accessLevel },
      view,
      singularView: singular,
      mainHeader,
      data,
      count,
      mobile
    } = this.props

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

        <main style={this.styleMain()}>
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
              <h4>{`${count} ${count > 1? view : singular()}`}</h4>
              :
              mobile?
              <div>
                <AddNew
                  style={{alignSelf: 'end'}}
                  linkPath={`/${accessLevel}/${view.toLowerCase()}/new`}
                  type={singular()}
                />
              </div>
              :
              null
            }
          </div>
        </main>

      </div>
    )
  }
}
