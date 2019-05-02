class InventorySerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers
  attributes :id, :photo, :category, :name, :manufacturer, :total_owned, :sell_price, :rental_price, :net_cost_per_invoice, :purchase_price
  def category
    if object.category
      object.category
    end
  end

  def total_owned
    if object.total_owned
      object.total_owned
    end
  end

  def manufacturer
    if object.manufacturer
      object.manufacturer
    end
  end

  def photo
    if object.photo.attached?
    # if object.photo.variable?
    #   variant = object.photo.variant(resize: "300x300")
    #   short_url = rails_representation_url(variant, only_path: true)
    #   return 'http://localhost:3001' + short_url
    # else
    short_url = rails_blob_url(object.photo, only_path: true)
    return 'http://localhost:3001' + short_url
    end
  end

end
