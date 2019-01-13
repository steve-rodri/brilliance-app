class Contact < ApplicationRecord
  has_one :client, dependent: :nullify
  has_many :email_address, dependent: :destroy
end
