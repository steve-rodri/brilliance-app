require 'csv'
Contact.destroy_all

#seed Contacts
csv_text = File.read(Rails.root.join('lib','seeds', 'Contacts.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Contact.create! ({
    photo: row['photo'],
    prefix: row['prefix'],
    first_name: row['first_name'],
    last_name: row['last_name'],
    phone_number: row['phone_number'],
    ss: row['ss'],

    created_at: row['created_at']
  })
end
puts "There are now #{Contact.count} rows in the Contacts table"
