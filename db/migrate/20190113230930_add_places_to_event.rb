class AddPlacesToEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :location_id, :integer, index: true
    add_foreign_key :events, :places, column: :location_id

    add_column :events, :call_location_id, :integer, index: true
    add_foreign_key :events, :places, column: :call_location_id
  end
end
