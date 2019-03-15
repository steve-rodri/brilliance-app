require 'csv'

Contact.destroy_all
Company.destroy_all
Place.destroy_all
EmailAddress.destroy_all
Address.destroy_all
Client.destroy_all
Event.destroy_all
Invoice.destroy_all
Employee.destroy_all
EventEmployee.destroy_all
RunSheet.destroy_all
Line.destroy_all
Item.destroy_all
ItemContent.destroy_all
Content.destroy_all
Inventory.destroy_all
Expense.destroy_all

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
    work_email: row['work_email'],
    ss: row['ss'],

    created_at: row['created_at']
  })
end
puts "There are now #{Contact.count} rows in the Contacts table"

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
    kind: row['kind'],
    notes: row['notes'],
    start: row['event_start_tz'],
    summary: row['summary'],
    tags: row['tags'],

    location_id: row['location_id'],
    call_location_id: row['call_location_id'],
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
    kind: row['type'],
    status: row['status'],
    payment_status: row['payment_status'],
    payment_type: row['payment_type'],
    commission_actual: row['commission_actual'],
    commission_paid: row['commission_paid'],
    check_info: row['check_info'],
    discount: row['discount'],
    deposit: row['deposit'],
    tip: row['tip'],
    refund: row['refund'],

    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Invoice.count} rows in the Invoices table"

#seed Employee
csv_text = File.read(Rails.root.join('lib','seeds', 'Staff.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Employee.create! ({
    active?: row['active_inactive'],
    labor?: row['labor'],
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
puts "There are now #{EventEmployee.count} rows in the EventEmployees table"

#seed Line
csv_text = File.read(Rails.root.join('lib','seeds', 'Lines.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Line.create! ({
    inc: row['inc'],
    inc_in_commission: row['inc_in_commission'],
    discount_adj: row['discount_adj'],

    invoice_id: row['invoice_id'],
    item_id: row['item_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Line.count} rows in the Lines table"

#seed Item
csv_text = File.read(Rails.root.join('lib','seeds', 'Items.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Item.create! ({
    kind: row['kind'],
    install: row['install'],
    description: row['description'],
    additional_notes: row['additional_notes'],
    quantity: row['quantity'],
    discount_adj: row['discount_adj'],

    created_at: row['created_at']
  })
end
puts "There are now #{Item.count} rows in the Items table"

#seed ItemContent
csv_text = File.read(Rails.root.join('lib','seeds', 'Item_Content.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  ItemContent.create! ({

    created_at: row['created_at']
  })
end
puts "There are now #{ItemContent.count} rows in the ItemContent table"

#seed Content
csv_text = File.read(Rails.root.join('lib','seeds', 'Contents.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Content.create! ({

    item_id: row['item_id'],
    content_id: row['content_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Content.count} rows in the Contents table"

#seed Inventory
csv_text = File.read(Rails.root.join('lib','seeds', 'Inventory.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Inventory.create! ({

    category: row['category'],
    name: row['name'],
    manufacturer: row['manufacturer'],
    picture: row['picture'],
    total_owned: row['total_owned'],
    sell_price: row['sell_price'],
    rental_price: row['rental_price'],
    net_cost_per_invoice: row['net_cost_per_invoice'],
    purchase_price: row['purchase_price'],

    created_at: row['created_at']
  })
end
puts "There are now #{Inventory.count} rows in the Inventories table"

#seed RunSheet
csv_text = File.read(Rails.root.join('lib','seeds', 'Run_Sheets.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  RunSheet.create! ({
    guest_of_honor: row['guest_of_honor'],
    dj: row['dj'],
    walls_foundation: row['walls_foundation'],
    dome_foundation: row['dome_foundation'],
    coffer_foundation: row['coffer_foundation'],
    columns_foundation: row['columns_foundation'],
    elevator: row['elevator'],
    bar: row['bar'],
    tier: row['tier'],
    walls_entrance: row['walls_entrance'],
    intells_entrance: row['intells_entrance'],
    dome_entrance: row['dome_entrance'],
    candle_lighting: row['candle_lighting'],
    logo: row['logo'],
    montage: row['montage'],
    screens: row['screens'],
    bar_screens_adult_cocktail: row['bar_screens_adult_cocktail'],
    kids_zeus_room: row['kids_zeus_room'],
    zapshots: row['zapshots'],
    foundation: row['foundation'],
    intro_bridal_party: row['intro_bridal_party'],
    bride_and_groom: row['bride_and_groom'],
    first_dance: row['first_dance'],
    toast: row['toast'],
    dinner: row['dinner'],
    cake_cutting: row['cake_cutting'],
    bride_and_father: row['bride_and_father'],
    groom_and_mother: row['groom_and_mother'],
    comments: row['comments'],

    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{RunSheet.count} rows in the RunSheets table"

#seed Expense
csv_text = File.read(Rails.root.join('lib','seeds', 'Expenses.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Expense.create! ({
    type: row['type'],
    amount: row['amount'],
    reimbursement_type: row['reimbursement_type'],
    receipt: row['receipt'],
    paid: row['paid'],
    notes: row['notes'],
    staff_id: row['staff_id'],
    event_id: row['event_id'], 
    created_at: row['created_at']
  })
end
puts "There are now #{Expense.count} rows in the Expenses table"
