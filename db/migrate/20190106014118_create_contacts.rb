class CreateContacts < ActiveRecord::Migration[5.2]
  def change
    create_table :contacts do |t|
      t.string :photo
      t.string :prefix
      t.string :first_name
      t.string :last_name
      t.string :phone_number
      t.string :work_email
      t.string :ss

      t.timestamps
    end
  end
end
