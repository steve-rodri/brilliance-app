class CreateAddresses < ActiveRecord::Migration[5.2]
  def change
    create_table :addresses do |t|
      t.string :address
      t.string :street
      t.string :street_line_two
      t.string :city
      t.string :state
      t.integer :zip

      t.timestamps
    end
  end
end
