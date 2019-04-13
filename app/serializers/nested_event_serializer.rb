class NestedEventSerializer < ApplicationSerializer
  attributes :id, :action, :break, :break_start, :call_time, :clock_out, :confirmation, :description, :driving_time, :end, :gc_id, :html_link, :kind, :notes, :start, :summary, :tags
  has_one :invoice, serializer: NestedInvoiceSerializer
  has_one :place_location, key: 'location', serializer: NestedPlaceLocationSerializer
  has_one :place_call_location, key: 'call_location', serializer: NestedPlaceCallLocationSerializer
  has_one :contact_creator, key: 'creator', serializer: ContactSerializer
end
