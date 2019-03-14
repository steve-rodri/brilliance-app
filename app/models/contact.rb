class Contact < ApplicationRecord
  has_one :client, dependent: :nullify
  has_many :email_address, dependent: :destroy
  has_many :creator_events, class_name: 'Event', foreign_key: 'creator_id', dependent: :nullify
end
