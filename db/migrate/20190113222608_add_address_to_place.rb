class AddAddressToPlace < ActiveRecord::Migration[5.2]
  def change
    add_reference :places, :address, foreign_key: true
  end
end
