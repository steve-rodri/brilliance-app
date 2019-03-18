class NestedLineSerializer < ActiveModel::Serializer
  attributes :id, :inc, :inc_in_commission, :discount_adj
  has_one :item
end
