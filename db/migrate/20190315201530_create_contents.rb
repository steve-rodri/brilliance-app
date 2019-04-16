class CreateContents < ActiveRecord::Migration[5.2]
  def change
    create_table :contents do |t|
      t.string :kind
      t.string :description
      t.boolean :description_only, default: false
      t.integer :quantity, default: 1
      t.boolean :inc, default: false
      t.boolean :inc_discount_in_opct, default: false
      t.float :discount_adj, default: 0.00
      t.integer :hours_for_labor_only
      t.boolean :subcontracted, default: false

      t.timestamps
    end
  end
end
