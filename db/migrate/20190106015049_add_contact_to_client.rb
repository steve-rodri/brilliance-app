class AddContactToClient < ActiveRecord::Migration[5.2]
  def change
    add_reference :clients, :contact, foreign_key: true
  end
end
