import React from 'react'
import numeral from 'numeral'
import { squareIcon } from '../../../../../../../helpers/icons'

const description = (item) => {
  if (item) {
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
}

const contents = (item) => {
  if (item) {
    const contents = [...item.contents]
    if (contents && contents.length > 1) {
      return contents.reverse().map(content => {
        if (content.descriptionOnly) {

          if (content.description) {
            return (
              <li key={content.id}>{content.description}</li>
            )
          }

        } else if (content.inventory) {

          if (content.description) {
            return (
              <li key={content.id}>{`${content.inventory.name} ${content.description}`}</li>
            )
          } else {
            return (
              <li key={content.id}>{content.inventory.name}</li>
            )
          }

        }
        return null
      })
    }
  }
}

const inc = (line) => {
  if (line) {
    const included = line.inc

    if (included) {
      return squareIcon(['fas', 'square'])
    } else {
      return squareIcon(['far', 'square'])
    }
  }
}

const quantity = (line) => {
  if (line) {
    const { item } = line

    if (item) {
      if (item.useQuantity) {

        const contents = [...item.contents]
        if (contents && contents.length === 1) {
          const content = contents[0]
          if (content.quantity) {
            return item.quantity * content.quantity
          }
        } else {
          return item.quantity
        }

      } else {

        const contents = [...item.contents]
        if (contents && contents.length === 1) {
          const content = contents[0]
          if (content.quantity) {
            return content.quantity
          }
        }

      }
    }
  }
}

const price = (line, invoiceType, format) => {
  if (line) {
    const { item } = line

    const inventoryPrice = (content) => {
      const { inventory } = content
      if (inventory) {
        if (invoiceType === 'Rental Contract') {
          return inventory.rentalPrice
        } else {
          return inventory.sellPrice
        }
      } else {
        return 0
      }
    }

    const sumOfContents = () => {
      const { contents } = item

      if (contents && contents.length === 1) {
        const content = contents[0]
        if (content.inc) {
          return 0
        } else {
          return inventoryPrice(content) * content.quantity - content.discountAdj
        }

      } else if (contents && contents.length > 1) {
        const prices = contents.map( content => {
          return inventoryPrice(content) * content.quantity - content.discountAdj
        })
        const sum = prices.reduce((a, c) => a + c)
        return sum

      } else {
        return 0
      }
    }

    const itemPrice = () => {
      if (item) {
        let quantity = item.quantity;
        if (line.quantity) quantity = line.quantity;
        const subPrice = sumOfContents() * quantity;
        return subPrice
      }
    }

    if (format) {
      if (line.inc) {
        return numeral(0).format('$0,0.00')
      } else {
        const totalPrice = itemPrice() - line.discountAdj
        return numeral(totalPrice).format('$0,0.00')
      }
    } else {
      if (line.inc) {
        return 0
      } else {
        const totalPrice = itemPrice() - line.discountAdj
        return totalPrice
      }
    }
  }
}

export {
  description,
  contents,
  inc,
  quantity,
  price
}
