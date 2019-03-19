import React from 'react'

function line(data){
  return (
    <tr key={data.id}>
      <td><p>{description(data.item)}</p></td>
      <td>{contents(data.item)}</td>
      <td><input type='checkbox' value={data.inc}/></td>
      <td></td>
    </tr>
  )
}

function description(item){
  const {
    contents, description, useDescription, useDescriptionOnly
  } = item

  if (useDescriptionOnly) {
    return description
  } else if (contents && contents.length === 1) {

    const content = contents[0]

    if (content.descriptionOnly) {
      if (useDescription) {
        return content.description +' '+ description
      } else {
        return content.description
      }
    } else if (content.inventory) {
      if (useDescription) {
        return content.inventory.name +' '+ description
      } else {
        return content.inventory.name
      }
    }

  } else if (contents && contents.length > 1) {
    return description
  }
}

function contents(item){
  const contents = [...item.contents]

  if (contents && contents.length > 1) {

    return contents.reverse().map(content => {

      if (content.descriptionOnly) {

        if (content.description) {

          return (
            <p key={content.id}>{content.description}</p>
          )

        }

      } else if (content.inventory) {

        if (content.description) {

          return (
            <p key={content.id}>{`${content.inventory.name} ${content.description}`}</p>
          )

        } else {

          return (
            <p key={content.id}>{content.inventory.name}</p>
          )

        }
      }

      return null
    })
  }
}



export { line }
