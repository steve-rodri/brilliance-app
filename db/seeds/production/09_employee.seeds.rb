require 'csv'
Employee.destroy_all

#seed Employee
csv_text = File.read(Rails.root.join('lib','seeds', 'Staff.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Employee.create! ({
    active: row['active'],
    labor: row['labor'],
    rate_hand_per_job: row['rate_hand_per_job'],
    rate_full_job: row['rate_full_job'],
    rate_on_premise_one_man: row['rate_on_premise_one_man'],
    rate_on_premise: row['rate_on_premise'],
    rate_hourly: row['rate_hourly'],
    rate_hourly_office_shop: row['rate_hourly_office_shop'],
    rate_demo: row['rate_demo'],

    contact_id: row['contact_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Employee.count} rows in the Employees table"
