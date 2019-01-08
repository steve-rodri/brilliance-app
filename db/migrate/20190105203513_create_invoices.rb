class CreateInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :invoices do |t|
      t.string :kind
      t.string :status
      t.string :payment_status
      t.string :payment_type
      t.string :commission_paid
      t.string :check_info
      t.float :discount
      t.float :tip
      t.float :refund

      t.timestamps
    end
  end
end
