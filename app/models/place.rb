class Place < ApplicationRecord
  belongs_to :company, optional:true
  belongs_to :address, optional:true
  has_many :call_location_events, class_name: 'Event', foreign_key: 'call_location_id', dependent: :nullify
  has_many :location_events, class_name: 'Event', foreign_key: 'location_id', dependent: :nullify
end
