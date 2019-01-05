class AddEventToInvoice < ActiveRecord::Migration[5.2]
  def change
    add_reference :invoices, :event, foreign_key: true
  end
end
