require 'csv'
Line.destroy_all

#seed Line
Line.create! ([
  {
    invoice_id: 1,
    item_id: 1
  },
  {
    invoice_id: 1,
    item_id: 2
  },
  {
    invoice_id: 1,
    item_id: 3
  },
  {
    invoice_id: 2,
    item_id: 1
  },
  {
    invoice_id: 2,
    item_id: 2
  },
  {
    invoice_id: 3,
    item_id: 4
  },
  {
    invoice_id: 3,
    item_id: 2
  },
  {
    invoice_id: 3,
    item_id: 1
  },
  {
    invoice_id: 3,
    item_id: 5
  },
  {
    invoice_id: 4,
    item_id: 5
  },
  {
    invoice_id: 4,
    item_id: 4
  },
  {
    invoice_id: 5,
    item_id: 2
  },
  {
    invoice_id: 5,
    item_id: 3
  },
  {
    invoice_id: 5,
    item_id: 4
  },
  {
    invoice_id: 5,
    item_id: 5
  },
  {
    invoice_id: 5,
    item_id: 1
  }
])

puts "There are now #{Line.count} rows in the Lines table"
