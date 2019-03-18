class Event < ApplicationRecord
  belongs_to :client, optional: true
  has_one :invoice, dependent: :nullify
  belongs_to :place_location, class_name: 'Place', foreign_key: 'location_id', optional: true
  belongs_to :place_call_location, class_name: 'Place', foreign_key: 'call_location_id', optional: true
  belongs_to :contact_creator, class_name: 'Contact', foreign_key: 'creator_id', optional: true
  has_many :event_employees, dependent: :destroy
  has_many :employees, through: :event_employees
  has_many :expenses
  accepts_nested_attributes_for  :event_employees
end
