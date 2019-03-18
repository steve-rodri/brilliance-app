class NestedItemContentSerializer < ActiveModel::Serializer
  attributes :id
  has_one :content
end
