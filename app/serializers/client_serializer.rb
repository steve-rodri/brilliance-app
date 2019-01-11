class ClientSerializer < ActiveModel::Serializer
  attributes :id
  has_one :contact, key: 'contact_info'
end
