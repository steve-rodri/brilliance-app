Event.destroy_all

#seed Events
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
    action: 'Strike',
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
