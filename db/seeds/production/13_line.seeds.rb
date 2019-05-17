require 'csv'
Line.destroy_all

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
