class ContactSerializer < ActiveModel::Serializer
  attributes :id,
  :photo,
  :prefix,
  :full_name,
  :first_name,
  :last_name,
  :phone_number,
  :work_email

  def full_name
    "#{object.first_name} #{object.last_name}"
  end
end
