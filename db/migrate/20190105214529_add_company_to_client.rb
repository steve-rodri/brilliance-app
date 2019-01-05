class AddCompanyToClient < ActiveRecord::Migration[5.2]
  def change
    add_reference :clients, :company, foreign_key: true
  end
end
