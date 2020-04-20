class AddContactToAddresses < ActiveRecord::Migration[5.2]
  def change
    add_reference :addresses, :contact, foreign_key: true
  end
end
