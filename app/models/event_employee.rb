class EventEmployee < ApplicationRecord
  belongs_to :event
  belongs_to :employee

  accepts_nested_attributes_for :employee
end
