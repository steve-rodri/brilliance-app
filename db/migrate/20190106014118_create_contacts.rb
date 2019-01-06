class CreateContacts < ActiveRecord::Migration[5.2]
  def change
    create_table :contacts do |t|
      t.string :Photo
      t.string :Prefix
      t.string :First_Name
      t.string :Last_Name
      t.string :Phone_Number
      t.string :Work_Email
      t.string :SS

      t.timestamps
    end
  end
end
