class CreateItems < ActiveRecord::Migration[5.2]
  def change
    create_table :items do |t|
      t.string :name
      t.string :kind
      t.string :install
      t.string :description
      t.string :additional_notes
      t.integer :quantity, default: 1
      t.float :discount_adj, default: 0.00
      t.boolean :use_description, default: true
      t.boolean :use_description_only, default: false
      t.boolean :use_quantity, default: true

      t.timestamps
    end
  end
end
