class CreateContacts < ActiveRecord::Migration[5.2]
  def change
    create_table :contacts do |t|
      t.string :First_Name
      t.string :Last_Name
      t.string :Phone_Number
      t.string :Work_Email
      t.string :SS_Number

      t.timestamps
    end
  end
end
