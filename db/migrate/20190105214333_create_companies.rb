class CreateCompanies < ActiveRecord::Migration[5.2]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :logo
      t.string :website
      t.string :phone_number

      t.timestamps
    end
  end
end
