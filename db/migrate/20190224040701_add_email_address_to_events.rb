class AddEmailAddressToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :organizer, :integer, index: true
    add_foreign_key :events, :email_addresses, column: :organizer

    add_column :events, :creator, :integer, index: true
    add_foreign_key :events, :email_addresses, column: :creator
  end
end
