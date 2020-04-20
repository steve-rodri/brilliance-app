require 'csv'
Event.destroy_all

#seed Events
csv_text = File.read(Rails.root.join('lib','seeds', 'Events.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Event.create! ({
    action: row['action'],
    break: row['break'],
    break_start: row['break_start_tz'],
    call_time: row['call_time_tz'],
    clock_out: row['clock_out_tz'],
    confirmation: row['confirmation'],
    description: row['description'],
    driving_time: row['driving_time'],
    end: row['event_end_tz'],
    gc_id: row['gc_id'],
    gc_i_cal_uid: row['gc_i_cal_uid'],
    kind: row['kind'],
    notes: row['notes'],
    start: row['event_start_tz'],
    summary: row['summary'],
    tags: row['tags'],

    client_id: row['client_id'],
    location_id: row['location_id'],
    call_location_id: row['call_location_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Event.count} rows in the Events table"
