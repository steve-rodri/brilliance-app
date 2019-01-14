class CreatePlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :places do |t|
      t.boolean :installation
      t.string :photo
      t.string :name
      t.string :short_name
      t.string :commission

      t.timestamps
    end
  end
end
