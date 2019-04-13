class NestedItemContentSerializer < ApplicationSerializer
  attributes :description, :description_only, :discount_adj, :hours_for_labor_only, :id, :inc, :inc_discount_in_opct, :inventory, :kind, :quantity

  has_one :content, key: 'inventory' do | serializer |
    serializer.inventory
  end

  def description
    object.content.description
  end

  def description_only
    object.content.description_only
  end

  def discount_adj
    object.content.discount_adj
  end

  def hours_for_labor_only
    object.content.hours_for_labor_only
  end

  def id
    object.content.id
  end

  def inc
    object.content.inc
  end

  def inc_discount_in_opct
    object.content.inc_discount_in_opct
  end

  def inventory
    object.content.inventory
  end

  def kind
    object.content.kind
  end

  def quantity
    object.content.quantity
  end

end
