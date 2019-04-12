require 'csv'
ItemContent.destroy_all

#seed Item Content
ItemContent.create! ([
  {
    item_id: 1,
    content_id: 1
  },
  {
    item_id: 2,
    content_id: 2
  },
  {
    item_id: 3,
    content_id: 3
  },
  {
    item_id: 4,
    content_id: 4
  },
  {
    item_id: 5,
    content_id: 5
  },
  {
    item_id: 6,
    content_id: 6
  },
  {
    item_id: 7,
    content_id: 7
  }
])

puts "There are now #{ItemContent.count} rows in the Item Content table"
