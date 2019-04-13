class ItemContentSerializer < ApplicationSerializer
  attributes :id
  has_one :item
  has_one :content
end
