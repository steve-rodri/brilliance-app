class Contact < ApplicationRecord
  has_one :employee, dependent: :nullify
  has_one :client, dependent: :nullify
  has_many :address, dependent: :destroy
  has_many :email_addresses, dependent: :destroy
  has_many :creator_events, class_name: 'Event', foreign_key: 'creator_id', dependent: :nullify

  accepts_nested_attributes_for :email_addresses, :client, :employee
end
