class CreateLines < ActiveRecord::Migration[5.2]
  def change
    create_table :lines do |t|
      t.boolean :inc, default: false
      t.boolean :inc_in_commission, default: false
      t.float :discount_adj, default: 0
      t.float :price, default: 0
      t.integer :quantity, default: 0
      t.integer :order
      t.references :invoice, foreign_key: true
      t.references :item, foreign_key: true

      t.timestamps
    end
  end
end
