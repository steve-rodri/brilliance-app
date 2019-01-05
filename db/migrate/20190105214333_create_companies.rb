class CreateCompanies < ActiveRecord::Migration[5.2]
  def change
    create_table :companies do |t|
      t.string :Name
      t.string :Logo
      t.string :Website
      t.string :Phone_Number

      t.timestamps
    end
  end
end
