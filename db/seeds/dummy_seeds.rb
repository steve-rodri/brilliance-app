Contact.destroy_all
Client.destroy_all
Event.destroy_all
Invoice.destroy_all

#seed Contacts
Contact.bulk_create! ([
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

#seed Clients
Client.bulk_create! (
  {
    contact_id: 1
  },
  {
    contact_id: 2
  },
  {
    contact_id: 3
  },
  {
    contact_id: 4
  }
])
puts "There are now #{Client.count} rows in the Clients table"

Event.bulk_create! ([
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: true,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    driving_time: Time.now(),
    end: Time.now(),
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),
    summary: 'Test Event',

    client_id: 2
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: true,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    driving_time: Time.now(),
    end: Time.now(),
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),
    summary: 'Test Event',

    client_id: 1
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: true,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    driving_time: Time.now(),
    end: Time.now(),
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),
    summary: 'Test Event',

    client_id: 3
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: true,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    driving_time: Time.now(),
    end: Time.now(),
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),
    summary: 'Test Event',

    client_id: 4
  },
  {
    action: 'Set up',
    call_time: Time.now(),
    clock_out: Time.now(),
    confirmation: true,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    driving_time: Time.now(),
    end: Time.now(),
    kind: 'Test',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    start: Time.now(),
    summary: 'Test Event',

    client_id: 1
  }
])

puts "There are now #{Event.count} rows in the Events table"

#seed Invoices
Invoice.bulk_create! ([
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
end
puts "There are now #{Invoice.count} rows in the Invoices table"
