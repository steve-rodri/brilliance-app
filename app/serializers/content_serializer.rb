class ContentSerializer < ActiveModel::Serializer
  attributes :id, :description, :quantity, :inc, :discount_adj, :kind, :hours_for_labor_only, :description_only, :inc_discount_in_opct
  has_one :inventory, serializer: NestedInventorySerializer
end
