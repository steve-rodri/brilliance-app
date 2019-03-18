require 'csv'
Client.destroy_all

#seed Clients
csv_text = File.read(Rails.root.join('lib','seeds', 'Clients.csv'))
csv = CSV.parse(csv_text, :headers => true, :skip_blanks => false, :encoding => 'ISO-8859-1')
csv.each do |row|
  Client.create! ({
    contact_id: row['contact_id'],
    company_id: row['company_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Client.count} rows in the Clients table"
