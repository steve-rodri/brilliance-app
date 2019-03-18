require 'csv'
Invoice.destroy_all

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
