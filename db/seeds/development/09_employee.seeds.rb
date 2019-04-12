Employee.destroy_all

#seed Employee
Employee.create! ([
  {
    active?: true,
    labor?: false,
    rate_hand_per_job: 0,
    rate_full_job: 0,
    rate_on_premise_one_man: 250,
    rate_on_premise: 200,
    rate_hourly: 25,
    rate_hourly_office_shop: 25,
    rate_demo: 25,

    contact_id: 2,
  },
  {
    active?: true,
    labor?: true,
    rate_hand_per_job: 100,
    rate_full_job: 100,
    rate_on_premise_one_man: 250,
    rate_on_premise: 200,
    rate_hourly: 25,
    rate_hourly_office_shop: 25,
    rate_demo: 25,

    contact_id: 3,
  },
  {
    active?: true,
    labor?: true,
    rate_hand_per_job: 100,
    rate_full_job: 100,
    rate_on_premise_one_man: 250,
    rate_on_premise: 200,
    rate_hourly: 25,
    rate_hourly_office_shop: 25,
    rate_demo: 25,

    contact_id: 4,
  }
])

puts "There are now #{Employee.count} rows in the Employees table"
