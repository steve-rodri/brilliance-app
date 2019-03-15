class CreateLines < ActiveRecord::Migration[5.2]
  def change
    create_table :lines do |t|
      t.boolean :inc
      t.boolean :inc_in_commission
      t.float :discount_adj
      t.references :invoice, foreign_key: true
      t.references :item, foreign_key: true

      t.timestamps
    end
  end
end
