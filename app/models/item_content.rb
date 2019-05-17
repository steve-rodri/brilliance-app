class ItemContent < ApplicationRecord
  belongs_to :item
  belongs_to :content

  validates :item, :content, presence: true

  accepts_nested_attributes_for :content
end
