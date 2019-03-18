require 'csv'
EventEmployee.destroy_all

#seed EventEmployee
csv_text = File.read(Rails.root.join('lib','seeds', 'Event_Staff.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  EventEmployee.create! ({
    confirmation: row['confirmation'],
    paid?: row['paid?'],
    position: row['position'],
    rate: row['rate'],
    clock_in: row['clock_in'],
    clock_out: row['clock_out'],
    break_minutes: row['break_minutes'],
    break?: row['break?'],
    hourly?: row['hourly?'],

    employee_id: row['staff_id'],
    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{EventEmployee.count} rows in the Event Employees table"
