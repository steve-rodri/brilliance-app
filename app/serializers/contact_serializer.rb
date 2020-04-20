class ContactSerializer < ApplicationSerializer
  attributes :id,
  :photo,
  :prefix,
  :full_name,
  :first_name,
  :last_name,
  :phone_number,
  :ss

  has_many :email_address, key: 'email_addresses', serializer: NestedEmailAddressSerializer
  has_many :address, key: 'addresses'

  def full_name
    if object.first_name
      if object.last_name

        if object.prefix
          "#{object.prefix} #{object.first_name} #{object.last_name}"
        else
          "#{object.first_name} #{object.last_name}"
        end

      else
        "#{object.first_name}"
      end

    else
      if object.last_name
        if object.prefix
          "#{object.prefix} #{object.last_name}"
        else
          "#{object.last_name}"
        end
      end
    end
  end
end
