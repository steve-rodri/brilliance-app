class ItemSerializer < ApplicationSerializer
  attributes :id, :kind, :install, :description, :additional_notes, :quantity, :discount_adj, :use_description, :use_description_only, :use_quantity
  has_many :item_contents, key: 'contents', serializer: NestedItemContentSerializer
end
