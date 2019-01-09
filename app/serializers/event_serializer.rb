class EventSerializer < ActiveModel::Serializer
  attributes :action, :break, :break_start, :call_time, :clock_out, :client, :confirmation, :creator, :description, :driving_time, :end, :gc_id, :html_link, :invoice, :kind, :notes, :start, :summary, :tags
belongs_to :client, foreign_key: true
has_one :invoice, serializer: NestedInvoiceSerializer
end
