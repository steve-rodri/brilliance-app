import React from 'react'
import numeral from 'numeral'
import { ReactComponent as CheckSquare } from '../../../../../../../icons/check-square.svg'
import { ReactComponent as Square } from '../../../../../../../icons/square.svg'

// -------------Line---------------

export const inc = (line) => {
  if (!line) return
  if (line.inc) return <CheckSquare width="25" height="25"/>
  return <Square width="25" height="25"/>
}

export const lineQty = (line) => {
  if (line) return itemQty(line.item)
}

export const linePrice = (line, invoiceType, options) => {
  let format;
  let override;
  if (options) {
    format = options.format
    override = options.override
  }

  if (!line) return 0

  //prc factors in lineQty
  const prc = () => {
    if (line.item.useQuantity) {
      let quantity = 0
      if (line.item) quantity = itemQty(line.item);
      if (line.quantity) quantity = line.quantity;
      return sumOfContents(line.item, invoiceType) * quantity;
    } else {
      return sumOfContents(line.item, invoiceType)
    }
  }

  let totalPrice = prc() - line.discountAdj
  if (line.price && !override) totalPrice = line.price

  if (format && line.inc) return numeral(0).format('$0,0.00')
  if (line.inc) return 0
  if (format) return numeral(totalPrice).format('$0,0.00')
  return totalPrice
}

export const linePhoto = (line) => {
  const { item } = line;
  if (!item) return;
  if (item.contents && item.contents.length === 1) {
    if (item.contents[0].inventory) {
      return item.contents[0].inventory.photo
    }
  }
}

// -------------Item---------------

export const itemDescription = (item) => {
  if (!item) return ''
  const { contents } = item

  if (
    (contents &&
    (!contents.length ||
    contents.length > 1)) ||
    item.useDescriptionOnly
  ) {
    if (item.description) return item.description
    return ''
  }

  const content = contentDescription(item.contents[0])

  if (item.description) return `${content} ${item.description}`

  return content
}

export const itemContents = (item) => {
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
  let contents = []
  if (item.contents) contents = [...item.contents]
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

export const sumOfContents = (item, invoiceType) => {
  const { contents } = item

  //if 1 piece of Content
  if (contents && contents.length === 1) {
    const content = contents[0]
    if (content.inc) return 0
    const { inventory } = content
    if (inventory) {
      return inventoryPrice(inventory, invoiceType) * content.quantity - content.discountAdj
    } else {
      return content.discountAdj
    }
  }

  //if more than 1 pieces of content
  if (contents && contents.length > 1) {
    const prices = contents.map( content => {
      const { inventory } = content
      if (inventory) {
        return inventoryPrice(inventory, invoiceType) * content.quantity - content.discountAdj
      } else {
        return content.discountAdj
      }
    })

    return prices.reduce((a, c) => a + c)
  }

  return 0
}

export const contentDescription = (content) => {
  if (!content) return ''
  const inventory = inventoryName(content.inventory)

  if (!inventory && !content.description) return ''
  if(content.description && content.descriptionOnly) return content.description
  if(inventory && !content.description) return inventory
  if(!inventory && content.description) return content.description

  return`${inventory} ${content.description}`
}

// ------------Inventory----------

export const inventoryPrice = (inventory, invoiceType, format) => {
  if (!inventory) return 0
  let price = 0

  if (invoiceType === 'Rental Contract') price = inventory.rentalPrice
  else price = inventory.sellPrice

  if (format) return numeral(price).format('$0,0.00')
  return price
}

export const inventoryName = (inventory) => {
  if (!inventory) return ''
  const { manufacturer, name } = inventory

  if (!name && !manufacturer) return ''
  if (!manufacturer) return name
  if (!name) return manufacturer

  return `${manufacturer} ${name}`
}
