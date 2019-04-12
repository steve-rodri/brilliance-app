require 'csv'
EventEmployee.destroy_all

#seed EventEmployee

EventEmployee.create! ([
  {
    confirmation: 'accepted',

    employee_id: 3,
    event_id: 1,
  },
  {
    confirmation: 'needsAction',

    employee_id: 4,
    event_id: 1,
  },
  {
    confirmation: 'accepted',

    employee_id: 3,
    event_id: 2,
  },
  {
    confirmation: 'declined',

    employee_id: 2,
    event_id: 3,
  },
  {
    confirmation: 'tentative',

    employee_id: 3,
    event_id: 3,
  },
  {
    confirmation: 'accepted',

    employee_id: 4,
    event_id: 3,
  },
  {
    confirmation: 'needsAction',

    employee_id: 3,
    event_id: 4,
  }
])

puts "There are now #{EventEmployee.count} rows in the Event Employees table"
