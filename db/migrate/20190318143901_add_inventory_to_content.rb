class AddInventoryToContent < ActiveRecord::Migration[5.2]
  def change
    add_reference :contents, :inventory, foreign_key: true
  end
end
