class EventEmployeeSerializer < ApplicationSerializer
  attributes :id, :confirmation, :paid?, :position, :rate, :clock_in, :clock_out, :break_minutes, :break?, :hourly?
  has_one :employee, key: 'info', serializer: NestedEmployeeSerializer
  has_one :event
end
