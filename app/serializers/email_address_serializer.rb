class EmailAddressSerializer < ApplicationSerializer
  attributes :id, :email_address
  belongs_to :contact, foreign_key: true
  belongs_to :company, foreign_key: true
end
