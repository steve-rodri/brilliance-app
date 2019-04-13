class LineSerializer < ApplicationSerializer
  attributes :id, :inc, :inc_in_commission, :discount_adj
  has_one :invoice
  has_one :item
end
