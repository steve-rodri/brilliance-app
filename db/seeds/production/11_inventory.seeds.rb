require 'csv'
Inventory.destroy_all

#seed Inventory
csv_text = File.read(Rails.root.join('lib','seeds', 'Inventory.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Inventory.create! ({
    category: row['category'],
    name: row['name'],
    manufacturer: row['manufacturer'],
    total_owned: row['total_owned'],
    sell_price: row['sell_price'],
    rental_price: row['rental_price'],
    net_cost_per_invoice: row['net_cost_per_invoice'],
    purchase_price: row['purchase_price'],

    created_at: row['created_at']
  }) do |i|
    if row['photo_file_name']
      puts row['photo_file_name']
      i.photo.attach(
        io: File.open(row['photo_file_path']),
        filename: row['photo_file_name'],
        content_type: "application/#{row['photo_file_type']}"
      )
    end
  end

end
puts "There are now #{Inventory.count} rows in the Inventory table"
