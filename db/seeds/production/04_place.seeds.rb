require 'csv'
Place.destroy_all

#seed Places
csv_text = File.read(Rails.root.join('lib','seeds', 'Places.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Place.create! ({
    installation: row['installation'],
    photo: row['photo'],
    name: row['name'],
    short_name: row['short_name'],
    commission: row['commission'],

    address_id: row['address_id'],
    company_id: row['company_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Place.count} rows in the Places table"
