class CreateEventEmployees < ActiveRecord::Migration[5.2]
  def change
    create_table :event_employees do |t|
      t.string :confirmation, default: 'needsAction'
      t.boolean :paid?, default: false
      t.string :position
      t.float :rate, default: 0
      t.date :clock_in
      t.date :clock_out
      t.integer :break_minutes, default: 0
      t.boolean :break?, default: false
      t.boolean :hourly?, default: false
      t.references :employee, foreign_key: true
      t.references :event, foreign_key: true

      t.timestamps
    end
  end
end
