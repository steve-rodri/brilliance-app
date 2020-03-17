import React from 'react'
import Edit from './Edit'
import Show from './Show'

export default function SubHeader(props){
  const { editMode } = props

  const styleComp = (name) => {
    const { editMode } = props
    let style = {}
    if (editMode) {
      switch (name) {
        case 'About':
          break;
        case 'Status':
          break;
        case 'Commission':
          break;
        default:
          break;
      }
    }
    return style;
  }

  const styleComponents = () => {
    const { editMode, mobile } = props
    let style = {};
    if (mobile) {
      style.gridTemplateColumns = "repeat(auto-fit, minmax(2rem, auto))"

      if (editMode) {
        style.gridAutoColumns = "auto";
        style.gridAutoRows = "auto";
        style.gridTemplateColumns = "repeat(auto-fit, minmax(19.75rem, auto))";
      }

    } else {
      style.gridAutoColumns = "minmax(15.25rem, 1fr)"
      style.gridTemplateColumns = "repeat(auto-fit, minmax(15.25rem, auto))"

      if (editMode) {
        style.gridAutoColumns = "auto";
        style.gridAutoRows = "auto";
        style.gridTemplateColumns = "repeat(auto-fit, minmax(19.75rem, auto))";
      }
    }
    return style;
  }
  return (
    <section className="SubHeader" style={styleComponents()}>
      {
        editMode?
        <Edit {...props} styleComp={styleComp}/>
        :
        <Show {...props} styleComp={styleComp}/>
      }
    </section>
  )
}
