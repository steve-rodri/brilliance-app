Client.destroy_all

#seed Clients
Client.create! ([
  {
    contact_id: 5
  },
  {
    contact_id: 6
  },
  {
    contact_id: 4,
    company_id: 2
  },
  {
    contact_id: 7
  }
])
puts "There are now #{Client.count} rows in the Clients table"
