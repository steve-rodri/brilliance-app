class ContactSerializer < ActiveModel::Serializer
  attributes :id,
  :photo,
  :prefix,
  :first_name,
  :last_name,
  :phone_number,
  :work_email
end
