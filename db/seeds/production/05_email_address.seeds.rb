require 'csv'
EmailAddress.destroy_all

#seed Email Addresses
csv_text = File.read(Rails.root.join('lib','seeds', 'Email_Addresses.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  EmailAddress.create! ({
    email_address: row['email_address'],

    contact_id: row['contact_id'],
    company_id: row['company_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{EmailAddress.count} rows in the Email Addresses table"
