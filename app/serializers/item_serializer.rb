class ItemSerializer < ActiveModel::Serializer
  attributes :id, :kind, :install, :description, :additional_notes, :quantity, :discount_adj
end
