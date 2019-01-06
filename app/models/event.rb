class Event < ApplicationRecord
  belongs_to :client, optional: true
  has_one :invoice, dependent: :nullify
end
