class NestedClientSerializer < ActiveModel::Serializer
  attributes :id
  has_one :contact, key: 'contact_info', serializer: NestedContactSerializer
  has_one :company, serializer: NestedCompanySerializer
end
