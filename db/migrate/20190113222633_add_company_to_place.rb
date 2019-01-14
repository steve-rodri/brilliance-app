class AddCompanyToPlace < ActiveRecord::Migration[5.2]
  def change
    add_reference :places, :company, foreign_key: true
  end
end
