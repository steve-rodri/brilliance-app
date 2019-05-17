require 'csv'
ItemContent.destroy_all

#seed Item Content
csv_text = File.read(Rails.root.join('lib','seeds', 'Item_Content.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  ItemContent.create! ({
    item_id: row['item_id'],
    content_id: row['content_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{ItemContent.count} rows in the Item Content table"
