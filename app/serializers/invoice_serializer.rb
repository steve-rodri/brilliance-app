class InvoiceSerializer < ApplicationSerializer
  attributes :id,
  :kind,
  :status,
  :payment_status,
  :payment_type,
  :commission_paid,
  :check,
  :discount,
  :deposit,
  :tip,
  :refund,
  :sub_total,
  :total,
  :balance

  belongs_to :event, foreign_key: true, serializer: NestedEventUnderInvoiceSerializer
  has_many :lines, serializer: NestedLineSerializer
end
