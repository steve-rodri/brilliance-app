require 'csv'
Address.destroy_all

#seed Addresses
csv_text = File.read(Rails.root.join('lib','seeds', 'Addresses.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Address.create! ({
    address: row['address'],

    created_at: row['created_at']
  })
end
puts "There are now #{Address.count} rows in the Addresses table"
