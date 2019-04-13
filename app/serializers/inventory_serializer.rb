class InventorySerializer < ApplicationSerializer
  attributes :id, :category, :name, :manufacturer, :picture, :total_owned, :sell_price, :rental_price, :net_cost_per_invoice, :purchase_price

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

end
