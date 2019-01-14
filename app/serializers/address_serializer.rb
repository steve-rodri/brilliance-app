class AddressSerializer < ActiveModel::Serializer
  attributes :id, :address
  has_many :places
end
