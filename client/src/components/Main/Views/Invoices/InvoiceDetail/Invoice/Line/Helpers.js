import React from 'react'
import numeral from 'numeral'
// import { squareIcon } from '../../../../../../../helpers/icons'
import { ReactComponent as CheckSquare } from '../../../../../../../icons/check-square.svg'
import { ReactComponent as Square } from '../../../../../../../icons/square.svg'

// -------------Line---------------

export const description = (item) => {
  if (!item) return
  const {
    contents,
    description,
    useDescription,
    useDescriptionOnly
  } = item
  let content = {}
  if (contents) content = contents[0]

  if (useDescriptionOnly) return description
  if (contents && (contents.length === 0 || contents.length > 1)) {
    return description
  }

  if (content.descriptionOnly) {
    if (useDescription || description) {
      return content.description +' '+ description
    }
    return content.description

  } else if (content.inventory) {
    if (useDescription || description) {
      return content.inventory.name +' '+ description
    }
    return content.inventory.name
  }
}

export const contents = (item) => {
  if (!item) return
  let contents = []
  if (item.contents) contents = [...item.contents]

  if (contents.length > 1) {

    return contents.reverse().map(content => {

      if (content.descriptionOnly && content.description) {
        return <li key={content.id}>{content.description}</li>
      }

      if (content.inventory && content.description) {
        return (
          <li key={content.id}>
            {`${content.inventory.name} ${content.description}`}
          </li>
        )
      }

      if (content.inventory) {
        return <li key={content.id}>{content.inventory.name}</li>
      }

      return <li key={content.id}>{content.description}</li>
    })
  }
}

export const inc = (line) => {
  if (!line) return
  if (line.inc) return <CheckSquare width="25" height="25"/>
  return <Square width="25" height="25"/>
}

export const quantity = (line) => {
  if (line) return itemQty(line.item)
}

export const price = (line, invoiceType, format) => {
  if (!line) return 0

  //prc factors in lineQty
  const prc = () => {
    if (!line.item) return false;
    let quantity = itemQty(line.item);
    if (line.quantity) quantity = line.quantity;
    return sumOfContents(line.item, invoiceType) * quantity;
  }
  const totalPrice = prc() - line.discountAdj

  if (format && line.inc) return numeral(0).format('$0,0.00')
  if (line.inc) return 0
  if (format) return numeral(totalPrice).format('$0,0.00')
  return totalPrice
}

// -------------Item---------------

export const itemPrice = (item, invoiceType, format) => {
  if (!item) return
  const qty = itemQty(item)
  const soc = sumOfContents(item, invoiceType)

  if (format) {
    if (qty) return numeral(soc * qty).format('$0,0.00');
    return numeral(soc).format('$0,0.00')
  }

  if (qty) return soc * qty;
  return soc
}

export const itemQty = (item) => {
  if (!item) return;

  const contents = [...item.contents]
  let content = {}
  const oneObj = contents && contents.length === 1
  if (oneObj) content = contents[0]

  if (item.useQuantity || item.quantity >= 1) {
    if (content.quantity) return item.quantity * content.quantity
    return item.quantity
  }

  if (content.quantity) return content.quantity
}

// ------------Contents-----------

const sumOfContents = (item, invoiceType) => {
    const { contents } = item

    //if 1 piece of Content
    if (contents && contents.length === 1) {
      const content = contents[0]

      if (content.inc) return 0
      return inventoryPrice(content, invoiceType) * content.quantity - content.discountAdj

    }

    //if more than 1 piece of content
    if (contents && contents.length > 1) {
      const prices = contents.map( content => {
        return inventoryPrice(content, invoiceType) * content.quantity - content.discountAdj
      })

      return prices.reduce((a, c) => a + c)
    }

    return 0
  }

// ------------Inventory----------

const inventoryPrice = (content, invoiceType) => {
  const { inventory } = content
  if (!inventory) return 0

  if (invoiceType === 'Rental Contract') {
    return inventory.rentalPrice
  }

  return inventory.sellPrice
}
