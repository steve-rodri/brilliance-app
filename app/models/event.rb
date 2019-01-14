class Event < ApplicationRecord
  belongs_to :client, optional: true
  has_one :invoice, dependent: :nullify
  belongs_to :location, class_name: 'Place', foreign_key: 'location_id', optional: true
  belongs_to :call_location, class_name: 'Place', foreign_key: 'call_location_id', optional: true
end
