Contact.destroy_all

#seed Contacts
Contact.create! ([
  {
    first_name: 'Michael',
    last_name: 'Scott',
    phone_number: '555-123-4567',
    work_email: 'Michael_Scott@gmail.com',
  },
  {
    first_name: 'Pam',
    last_name: 'Beasely',
    phone_number: '555-123-4567',
    work_email: 'Pam_Beasely@gmail.com',
  },
  {
    first_name: 'Jim',
    last_name: 'Halpert',
    phone_number: '555-123-4567',
    work_email: 'Jim_Halpert@gmail.com',
  },
  {
    first_name: 'Dwight',
    last_name: 'Schrute',
    phone_number: '666-666-6666',
    work_email: 'Dwight.Schrute@schrutefarms.com',
  },
  {
    first_name: 'Steve',
    last_name: 'Smith',
    phone_number: '555-123-4567',
    work_email: 'steve_smith@gmail.com',
  },
  {
    first_name: 'Dave',
    last_name: 'Jones',
    phone_number: '555-123-4567',
    work_email: 'dave_jones@gmail.com',
  },
  {
    first_name: 'Natasha',
    last_name: 'Jones',
    phone_number: '555-123-4567',
    work_email: 'natasha_smith@gmail.com',
  },
  {
    first_name: 'Jaden',
    last_name: 'Smith',
    phone_number: '555-123-4567',
    work_email: 'natasha_smith@gmail.com',
  },
])
puts "There are now #{Contact.count} rows in the Contact table"
