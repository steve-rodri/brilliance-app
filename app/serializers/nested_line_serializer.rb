class NestedLineSerializer < ApplicationSerializer
  attributes :id, :inc, :inc_in_commission, :discount_adj, :price, :quantity
  has_one :item
end
