class CreateInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :invoices do |t|
      t.string :Type
      t.string :Status
      t.string :Payment_Status
      t.string :Payment_Type
      t.string :Commission_Paid
      t.string :Check_Info
      t.float :Discount
      t.float :Tip
      t.float :Refund

      t.timestamps
    end
  end
end
