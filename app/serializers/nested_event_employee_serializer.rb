class NestedEventEmployeeSerializer < ActiveModel::Serializer
  attributes :id, :confirmation, :paid?, :position, :rate, :clock_in, :clock_out, :break_minutes, :break?, :hourly?
  has_one :employee, key: 'info', serializer: NestedEmployeeSerializer
end
