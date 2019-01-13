class CompanySerializer < ActiveModel::Serializer
  attributes :id,
  :name,
  :logo,
  :website,
  :phone_number
end
