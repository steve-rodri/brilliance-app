class Company < ApplicationRecord
  has_one :client, dependent: :nullify
  has_many :places, dependent: :nullify
  has_many :email_addresses, dependent: :nullify

  accepts_nested_attributes_for :email_addresses
end
