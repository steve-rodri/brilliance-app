class AddressSerializer < ApplicationSerializer
  attributes :id, :address, :street, :street_line_two, :city, :state, :zip, :full_address

  def full_address
    address = "#{:street} #{:street_line_two} #{:city}, #{:state}, #{:zip}"
    address.strip
  end
end
