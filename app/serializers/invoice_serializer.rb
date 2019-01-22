class InvoiceSerializer < ActiveModel::Serializer
  attributes :id,
  :kind,
  :status,
  :payment_status,
  :payment_type,
  :commission_paid,
  :check_info,
  :discount,
  :tip,
  :refund

  belongs_to :event, foreign_key: true, serializer: NestedEventUnderInvoiceSerializer
end
