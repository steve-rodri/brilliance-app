require 'csv'
Content.destroy_all

#seed Content
csv_text = File.read(Rails.root.join('lib','seeds', 'Content.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Content.create! ({
    description: row['description'],
    quantity: row['quantity'],
    inc: row['inc'],
    discount_adj: row['discount_adj'],
    kind: row['kind'],
    hours_for_labor_only: row['hours_for_labor_only'],
    description_only: row['description_only'],
    inc_discount_in_opct: row['inc_discount_in_opct'],

    inventory_id: row['inventory_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Content.count} rows in the Contents table"
