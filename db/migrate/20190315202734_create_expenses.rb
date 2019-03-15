class CreateExpenses < ActiveRecord::Migration[5.2]
  def change
    create_table :expenses do |t|
      t.string :type
      t.float :amount
      t.string :reimbursement_type
      t.string :receipt
      t.boolean :paid
      t.string :notes
      t.references :employee, foreign_key: true
      t.references :event, foreign_key: true

      t.timestamps
    end
  end
end
