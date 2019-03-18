class CreateContents < ActiveRecord::Migration[5.2]
  def change
    create_table :contents do |t|
      t.string :description
      t.integer :quantity, default: 1
      t.boolean :inc, default: false
      t.float :discount_adj, default: 0
      t.string :kind
      t.integer :hours_for_labor_only
      t.boolean :description_only
      t.boolean :inc_discount_in_opct

      t.timestamps
    end
  end
end
