require 'csv'
Item.destroy_all

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
    use_description: row['use_description'],
    use_description_only: row['use_description_only'],
    use_quantity: row['use_quantity'],

    created_at: row['created_at']
  })
end
puts "There are now #{Item.count} rows in the Items table"
