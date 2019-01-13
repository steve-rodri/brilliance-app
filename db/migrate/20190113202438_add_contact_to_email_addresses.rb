class AddContactToEmailAddresses < ActiveRecord::Migration[5.2]
  def change
    add_reference :email_addresses, :contact, foreign_key: true
  end
end
