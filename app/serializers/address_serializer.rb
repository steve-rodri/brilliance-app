class AddressSerializer < ApplicationSerializer
  attributes :id, :address, :street, :city, :state, :zip

  def address
    address = "#{object.street}, #{object.city}, #{object.state}, #{object.zip}"
    address.strip
  end
end
