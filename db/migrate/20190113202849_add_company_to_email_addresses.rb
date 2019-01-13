class AddCompanyToEmailAddresses < ActiveRecord::Migration[5.2]
  def change
    add_reference :email_addresses, :company, foreign_key: true
  end
end
