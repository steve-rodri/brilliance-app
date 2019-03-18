require 'csv'
Company.destroy_all

#seed Companies
csv_text = File.read(Rails.root.join('lib','seeds', 'Companies.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Company.create! ({
    name: row['name'],
    logo: row['logo'],
    website: row['website'],
    phone_number: row['phone_number'],

    created_at: row['created_at']
  })
end
puts "There are now #{Company.count} rows in the Companies table"
