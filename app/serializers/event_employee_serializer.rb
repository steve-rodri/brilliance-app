class EventEmployeeSerializer < ActiveModel::Serializer
  attributes :id, :confirmation, :paid?, :position, :rate, :clock_in, :clock_out, :break_minutes, :break?, :hourly?
  has_one :employee
  has_one :event
end
