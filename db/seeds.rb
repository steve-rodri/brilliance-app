require 'csv'

Contact.destroy_all
Client.destroy_all
Event.destroy_all

#seed Contacts
csv_text = File.read(Rails.root.join('lib','seeds', 'Contacts.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Contact.create! ({
    Photo: row['Photo'],
    Prefix: row['Prefix'],
    First_Name: row['First_Name'],
    Last_Name: row['Last_Name'],
    Phone_Number: row['Phone_Number'],
    Work_Email: row['Work_Email'],
    SS: row['SS'],

    created_at: row['created_at']
  })
end
puts "There are now #{Contact.count} rows in the Contact table"

#seed Clients
csv_text = File.read(Rails.root.join('lib','seeds', 'Clients.csv'))
csv = CSV.parse(csv_text, :headers => true, :skip_blanks => false, :encoding => 'ISO-8859-1')
csv.each do |row|
  Client.create! ({
    contact_id: row['contact_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Client.count} rows in the Clients table"

#seed Events
csv_text = File.read(Rails.root.join('lib','seeds', 'Events.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Event.create! ({
    Confirmation: row['Confirmation'],
    Action: row['Action'],
    Kind: row['Kind'],
    Staff_Status: row['Staff_Status'],
    Event_Start: row['Event_Start'],
    Event_End: row['Event_End'],
    Call_Time: row['Call_Time'],
    Clock_Out: row['Clock_Out'],
    Break_Start: row['Break_Start'],
    Driving_Time: row['Driving_Time'],
    Break: row['Break'],
    Description: row['Description'],
    Summary: row['Summary'],
    Notes: row['Notes'],
    Tags: row['Tags'],

    client_id: row['client_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Event.count} rows in the Events table"

#seed Invoices
csv_text = File.read(Rails.root.join('lib','seeds', 'Invoices.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Invoice.create! ({
    Type: row['Type'],
    Status: row['Status'],
    Payment_Status: row['Payment_Status'],
    Payment_Type: row['Payment_Type'],
    Commission_Paid: row['Commission_Paid'],
    Check_Info: row['Check_Info'],
    Discount: row['Discount'],
    Tip: row['Tip'],

    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Invoice.count} rows in the Invoices table"
