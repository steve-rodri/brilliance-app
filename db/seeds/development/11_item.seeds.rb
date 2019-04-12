Item.destroy_all

#seed Item
Item.create! ([
  {
    kind: 'invoiceSpecific'
  },
  {
    kind: 'invoiceSpecific',
  },
  {
    kind: 'invoiceSpecific',
  },
  {
    kind: 'invoiceSpecific',
  },
  {
    kind: 'invoiceSpecific',
  },
  {
    kind: 'invoiceSpecific',
  },
  {
    kind: 'invoiceSpecific',
  }
])
puts "There are now #{Item.count} rows in the Items table"
