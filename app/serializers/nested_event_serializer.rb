class NestedEventSerializer < ActiveModel::Serializer
  attributes :id, :action, :break, :break_start, :call_time, :clock_out, :confirmation, :creator, :description, :driving_time, :end, :gc_id, :html_link, :kind, :notes, :start, :summary, :tags
  has_one :invoice, serializer: NestedInvoiceSerializer
  has_one :place_location, serializer: NestedPlaceLocationSerializer
  has_one :place_call_location, serializer: NestedPlaceCallLocationSerializer
end
