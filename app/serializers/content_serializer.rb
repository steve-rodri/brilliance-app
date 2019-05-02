class ContentSerializer < ApplicationSerializer
  attributes :id, :inventory, :description, :quantity, :inc, :discount_adj, :kind, :hours_for_labor_only, :description_only, :inc_discount_in_opct

  # def inventory
  #   inventory = Inventory.where(id: object.inventory_id)
  #   if inventory.photo.attachment.blob.filename
  #     puts inventory
  #     return inventory.with_attached_photo
  #   else
  #     return inventory
  #   end
  # end


  def inventory
    Inventory.with_attached_photo.where(id: object.inventory_id)
  end
end
