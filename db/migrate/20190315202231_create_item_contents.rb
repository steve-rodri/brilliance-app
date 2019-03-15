class CreateItemContents < ActiveRecord::Migration[5.2]
  def change
    create_table :item_contents do |t|
      t.references :item, foreign_key: true
      t.references :content, foreign_key: true

      t.timestamps
    end
  end
end
