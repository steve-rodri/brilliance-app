import React, { Component } from 'react'
import { quantity, description, contents, price, inc } from './Helpers'
import { deleteIcon } from '../../../../../../Helpers/icons'

export default class Edit extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  // ---------------------------Lifecycle---------------------------------

  componentWillReceiveProps(nextProps){
    this.setup(nextProps)
  }

  componentDidMount(){
    this.setup(this.props)
  }

  // --------------------------Getters and Setters-------------------------

  setup = (props) => {
    const { line } = props
    console.log(line)
  }


  // ----------------------------View----------------------------------------

  render(){
    const { inv, line, handleLineChange, deleteLine } = this.props
    const c = contents(line.item)
    return (
      <tr key={line.id} className="Line">
        <td
          className="Invoice--cell Line--add-delete"
          onClick={deleteLine}
        >
          {deleteIcon('1x')}
        </td>

        <td className="Invoice--cell Line--quantity">
          <div>
            <input
              className="Line--input"
              name="quantity"
              type="number"
              value={quantity(line)}
              onChange={(e) => handleLineChange('quantity',line.id)}
            />
          </div>
        </td>

        <td className="Invoice--cell Line--item">
          <div className="Line--item-description"><p>{description(line.item)}</p></div>
          {c? <div className="Line--item-contents">{c}</div> : null}
        </td>

        <td
          className="Invoice--cell Line--inc"
          onClick={(e) => {
            e.stopPropagation()
            handleLineChange('inc', !line.inc, line.id)
          }}
        >
          {inc(line)}
        </td>

        <td className="Invoice--cell Line--price">
          <div>
            <p>$</p>
            <input
              className="Line--input"
              name="price"
              type="number"
              value={price(line, inv.kind)}

            />
          </div>
        </td>
      </tr>
    )
  }
}
