class ClientSerializer < ActiveModel::Serializer
  attributes :id
  has_many :event, key: 'events', serializer: NestedEventSerializer
  has_one :contact, key: 'contact_info', serializer: NestedContactSerializer
  has_one :company, serializer: NestedCompanySerializer
end
