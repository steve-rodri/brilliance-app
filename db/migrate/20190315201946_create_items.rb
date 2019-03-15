class CreateItems < ActiveRecord::Migration[5.2]
  def change
    create_table :items do |t|
      t.string :kind
      t.string :install
      t.string :description
      t.string :additional_notes
      t.integer :quantity
      t.string :discount_adj

      t.timestamps
    end
  end
end
