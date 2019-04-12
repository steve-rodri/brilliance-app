Company.destroy_all

#seed Companies
Company.create! ([
  {
    name: 'Dunder Mifflin',
    website: 'http://www.dundermifflin.com',
    phone_number: '555-123-4567',
  },
  {
    name: 'Schrute Farms',
    website: 'http://www.schrutefarms.com',
    phone_number: '555-555-5555'
  }
])
puts "There are now #{Company.count} rows in the Company table"
