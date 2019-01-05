class Client < ApplicationRecord
  belongs_to :contact
  has_many :event
end
