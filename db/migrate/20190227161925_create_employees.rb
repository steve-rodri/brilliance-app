class CreateEmployees < ActiveRecord::Migration[5.2]
  def change
    create_table :employees do |t|
      t.boolean :active?
      t.boolean :labor?
      t.float :rate_hand_per_job
      t.float :rate_full_job
      t.float :rate_on_premise_one_man
      t.float :rate_on_premise
      t.float :rate_hourly
      t.float :rate_hourly_office_shop
      t.float :rate_demo
      t.references :contact, foreign_key: true

      t.timestamps
    end
  end
end
