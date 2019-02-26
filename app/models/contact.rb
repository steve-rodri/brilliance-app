class Contact < ApplicationRecord
  has_one :client, dependent: :nullify
  has_many :email_address, dependent: :destroy
  has_many :event_creators, class_name: 'Event', foreign_key: 'creator', dependent: :nullify
end
