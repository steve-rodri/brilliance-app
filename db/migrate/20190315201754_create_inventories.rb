class CreateInventories < ActiveRecord::Migration[5.2]
  def change
    create_table :inventories do |t|
      t.string :category
      t.string :name
      t.string :manufacturer
      t.string :picture
      t.integer :total_owned
      t.float :sell_price, default: 0
      t.float :rental_price, default: 0
      t.float :net_cost_per_invoice, default: 0
      t.float :purchase_price, default: 0

      t.timestamps
    end
  end
end
