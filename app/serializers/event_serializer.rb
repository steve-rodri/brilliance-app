class EventSerializer < ActiveModel::Serializer
  attributes :id, :action, :break, :break_start, :client, :call_time, :clock_out, :confirmation, :creator, :description, :driving_time, :end, :gc_id, :html_link, :kind, :notes, :start, :summary, :tags
  has_one :client
  has_one :invoice, serializer: NestedInvoiceSerializer
end
