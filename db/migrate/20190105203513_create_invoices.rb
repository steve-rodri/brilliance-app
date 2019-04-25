class CreateInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :invoices do |t|
      t.string :kind
      t.string :status
      t.string :payment_status, default: 'Not Paid'
      t.string :payment_type
      t.float :commission_actual
      t.boolean:commission_paid, default: false
      t.string :check
      t.float :deposit, default: 0
      t.float :discount, default: 0
      t.float :tip, default: 0
      t.float :refund, default: 0
      t.float :sub_total, default: 0
      t.float :total, default: 0
      t.float :balance, default: 0

      t.timestamps
    end
  end
end
