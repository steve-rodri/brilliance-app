class CreateEventEmployees < ActiveRecord::Migration[5.2]
  def change
    create_table :event_employees do |t|
      t.string :confirmation
      t.boolean :paid?
      t.string :position
      t.float :rate
      t.date :clock_in
      t.date :clock_out
      t.integer :break_minutes
      t.boolean :break?
      t.boolean :hourly?
      t.references :employee, foreign_key: true
      t.references :event, foreign_key: true

      t.timestamps
    end
  end
end
