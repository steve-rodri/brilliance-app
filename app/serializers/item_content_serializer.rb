class ItemContentSerializer < ActiveModel::Serializer
  attributes :id
  has_one :item
  has_one :content
end
