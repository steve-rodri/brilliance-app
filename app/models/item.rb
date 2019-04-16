class Item < ApplicationRecord
  has_many :lines, dependent: :nullify
  has_many :item_contents, dependent: :destroy
  has_many :contents, through: :item_contents
  accepts_nested_attributes_for :lines, :item_contents, :contents
end
