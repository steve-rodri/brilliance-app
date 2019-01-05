class Event < ApplicationRecord
  belongs_to :client
  has_one :invoice
end
