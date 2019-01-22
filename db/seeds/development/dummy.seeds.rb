Contact.destroy_all
Company.destroy_all
Place.destroy_all
Client.destroy_all
Event.destroy_all
Invoice.destroy_all

#seed Contacts
Contact.create! ([
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
    first_name: 'Michael',
    last_name: 'Scott',
    phone_number: '555-123-4567',
    work_email: 'Michael_Scott@gmail.com',
  },
  {
    first_name: 'Dwight',
    last_name: 'Schrute',
    phone_number: '666-666-6666',
    work_email: 'Dwight.Schrute@schrutefarms.com',
  }
])
puts "There are now #{Contact.count} rows in the Contact table"

#seed Companies
Company.create! ([
  {
    name: 'Dunder Mifflin',
    website: 'http://www.dundermifflin.com',
    phone_number: '555-123-4567',
  }
])
puts "There are now #{Contact.count} rows in the Contact table"

Place.create! ([
  {
    installation: false,
    name: 'Crest Hollow Country Club',
    short_name: 'CHCC'
  },
  {
    installation: true,
    name: 'Carlyle at the Palace',
    short_name: 'CATP'
  },
  {
    installation: true,
    name: 'The Heritage Club',
    short_name: 'THC'
  }
  ])

#seed Clients
Client.create! ([
  {
    contact_id: 1
  },
  {
    contact_id: 2
  },
  {
    contact_id: 3,
    company_id: 1
  },
  {
    contact_id: 4
  }
])
puts "There are now #{Client.count} rows in the Clients table"

Event.create! ([
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: "Unconfirmed",
    description: 'Lorem ipsum dolor sit amet',
    driving_time: Time.now(),
    end: Time.now() + 7200,
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),

    client_id: 2,
    location_id: 1
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: "Confirmed",
    description: 'Lorem ipsum dolor sit amet',
    driving_time: Time.now(),
    end: Time.now() + 7200,
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),

    client_id: 1,
    location_id: 2
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: "Confirmed",
    description: 'Lorem ipsum dolor sit amet',
    driving_time: Time.now(),
    end: Time.now() + 7200,
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),

    client_id: 3,
    location_id: 3
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: "Confirmed",
    description: 'Lorem ipsum dolor sit amet',
    driving_time: Time.now(),
    end: Time.now() + 7200,
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),

    client_id: 4,
    location_id: 2
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: "Unconfirmed",
    description: 'Lorem ipsum dolor sit amet',
    driving_time: Time.now(),
    end: Time.now() + 7200,
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),

    client_id: 1,
    location_id: 1
  }
])

puts "There are now #{Event.count} rows in the Events table"

#seed Invoices
Invoice.create! ([
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 1
  },
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 2
  },
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 3
  },
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 4
  },
  {
    kind: 'Production',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 5
  }
])
puts "There are now #{Invoice.count} rows in the Invoices table"
