class AddContactToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :creator, :integer, index: true
    add_foreign_key :events, :contacts, column: :creator
  end
end
