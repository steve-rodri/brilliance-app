class CreateEmailAddresses < ActiveRecord::Migration[5.2]
  def change
    create_table :email_addresses do |t|
      t.string :email_address
      t.boolean :notifications, default: false

      t.timestamps
    end
  end
end
