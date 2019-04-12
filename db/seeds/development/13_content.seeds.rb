require 'csv'
Content.destroy_all

#seed Content
Content.create! ([
  {
    inventory_id: 1,
  },
  {
    inventory_id: 2,
  },
  {
    inventory_id: 3,
  },
  {
    inventory_id: 4,
  },
  {
    inventory_id: 5,
  },
  {
    inventory_id: 6,
  },
  {
    inventory_id: 7,
  }  
])

puts "There are now #{Content.count} rows in the Contents table"
