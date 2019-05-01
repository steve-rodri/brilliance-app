import pluralize from 'pluralize'

function itemName(item) {
  if(!item.quantity){
  	if(!item.contents.length){
  		if(item.useDescription){
        if (item.description) {
          return item.description
        }
  	  }
    } else if(item.contents.length === 1){
    	if(item.useDescription){
    		if(item.useDescriptionOnly){
    			return item.description
        } else {
          return `${contentName(item.contents[0])} ${item.description}`
        }
      } else {
        contentName(item.contents[0])
      }
    } else if(item.contents.length > 1){
  		if(item.useDescription){
        return item.description
  		}
    }
  } else if(item.quantity === 1){
  	if(!item.contents.length){
  		if(item.useDescription){
  			if(item.useQuantity){
          return `${item.quantity} - ${item.description}`
        } else {
          return item.description
        }
      }
    } else if(item.contents.length === 1){
  		if(item.useQuantity){
  			if(item.useDescription){
  				if(item.useDescriptionOnly){
            return `${item.quantity} - ${item.description}`
          } else {
            return `${item.quantity} - ${contentName(item.contents[0])} ${item.description}`
          }
        } else {
          return `${item.quantity} - ${contentName(item.contents[0])}`
        }
      } else {
  			if(item.useDescription){
          if(item.useDescriptionOnly){
  					return item.description
  				} else {
            return `${contentName(item.contents[0])} ${item.description}`
          }
  			} else {
          return contentName(item.contents[0])
        }
      }
    } else if(item.contents.length > 1){
      if(item.useQuantity){
			  if(item.useDescription){
          return `${item.quantity} - ${item.description}`
        }
      } else {
  			if(item.useDescription){
  				return item.description
        }
	    }
    }
  } else if( item.quantity > 1){
  	if(!item.contents.length){
  		if(item.useDescription){
  			if(item.useQuantity){
          return `${item.quantity} - ${item.description}`
        } else {
  				return item.description
        }
  	  }
  	} else if(item.contents.length === 1){
  		if(item.useQuantity){
  			if(item.useDescription){
  				if(item.useDescriptionOnly){
  					if(item.description){
              return `${item.quantity} - ${item.description}`
  					} else {
              return `${item.quantity} - ${contentName(item.contents[0])}`
            }
  				}
  				if(!item.description){
  					return `${item.quantity} - ${pluralize(contentName(item.contents[0]))}`
  				}
  			} else {
          return `${item.quantity} - ${pluralize(contentName(item.contents[0]))}`
        }
      } else {
  			if(item.useDescription){
  				if(item.useDescriptionOnly){
  					if(item.description){
  						return item.description
  					}
  					if(!item.description){
              return contentName(item.contents[0])
            } else {
              return `${contentName(item.contents[0])} ${item.description}`
  					}
  				}
  				if( !item.description ){
  					return contentName(item.contents[0])
  			  }
  			}
  		}
  	} else if( item.contents.length > 1){
      if(item.useQuantity){
			  if(item.useDescription){
			    if(item.description){
            return `${item.quantity} - ${item.description}`
			    }
			  }
      } else {
			  if(item.useDescription){
				  if(item.description){
				    return item.description
			  	}
        }
      }
    }
  }
}

function contentName(content) {
  if(!content.quantity){
  	if(!content.inventory) return content.description
  	if(!content.description) return inventoryName(content.inventory)
  	if(content.descriptionOnly){
      return content.description
    } else {
      return `${inventoryName(content.inventory)} ${content.description}`
    }
  } else if(content.quantity === 1){
    if(!content.inventory) return `${content.quantity} - ${content.description}`
    if(!content.description) return `${content.quantity} - ${inventoryName(content.inventory)}`
		if(content.descriptionOnly){
      return `${content.quantity} - ${content.description}`
    } else {
      return `${content.quantity} - ${inventoryName(content.inventory)} ${content.description}`
    }
  } else if(content.quantity > 1) {
  	if(!content.inventory) return  `${content.quantity} - ${content.description}`
  	if(!content.description) return `${content.quantity} - ${pluralize(inventoryName(content.inventory))}`
		if(content.descriptionOnly){
      return `${content.quantity} - ${content.description}`
    } else {
      return `${content.quantity} - ${pluralize(inventoryName(content.inventory))} ${content.description}`
    }
  }
}

function inventoryName(inventory){
  if (inventory.name) {
    if (inventory.manufacturer) {
      return `${inventory.manufacturer} ${inventory.name}`
    } else {
      return inventory.name
    }
  }
}

export function name (item){
  return itemName(item)
}
