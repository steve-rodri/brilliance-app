class NestedInventorySerializer < ActiveModel::Serializer
  attributes :id, :category, :name, :manufacturer, :picture, :total_owned, :sell_price, :rental_price, :net_cost_per_invoice, :purchase_price
end
