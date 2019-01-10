class ClientSerializer < ActiveModel::Serializer
  has_one :contact, key: 'contact_info'
end
