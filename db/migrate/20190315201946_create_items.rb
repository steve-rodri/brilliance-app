class CreateItems < ActiveRecord::Migration[5.2]
  def change
    create_table :items do |t|
      t.string :kind
      t.string :install
      t.string :description
      t.string :additional_notes
      t.integer :quantity, default: 1
      t.string :discount_adj, default: 0
      t.boolean :use_description, default: false
      t.boolean :use_description_only, default: false
      t.boolean :use_quantity, default: false

      t.timestamps
    end
  end
end
