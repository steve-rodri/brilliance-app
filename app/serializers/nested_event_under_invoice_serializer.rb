class NestedEventUnderInvoiceSerializer < ActiveModel::Serializer
  attributes :id, :action, :break, :break_start, :call_time, :clock_out, :confirmation, :description, :driving_time, :end, :gc_id, :html_link, :kind, :notes, :start, :summary, :tags
  belongs_to :client, foreign_key: true, serializer: NestedClientSerializer
  has_one :place_location, key: 'location', serializer: NestedPlaceLocationSerializer
  has_one :place_call_location, serializer: NestedPlaceCallLocationSerializer
end
