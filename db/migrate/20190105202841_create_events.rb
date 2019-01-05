class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :Confirmation
      t.string :Action
      t.string :Kind
      t.string :Staff_Status
      t.datetime :Event_Start
      t.datetime :Event_End
      t.datetime :Call_Time
      t.datetime :Clock_Out
      t.datetime :Break_Start
      t.string :Driving_Time
      t.string :Break
      t.string :Description
      t.string :Summary
      t.text :Notes
      t.string :Tags

      t.timestamps
    end
  end
end
