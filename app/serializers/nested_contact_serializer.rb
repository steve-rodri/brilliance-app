class NestedContactSerializer < ActiveModel::Serializer
  attributes :id,
  :photo,
  :prefix,
  :full_name,
  :first_name,
  :last_name,
  :phone_number

  has_many :email_address, key: 'email_addresses'

  def full_name
    "#{object.first_name} #{object.last_name}"
  end
end
