class Content < ApplicationRecord
  has_many :item_contents, inverse_of: :content, autosave: true, dependent: :nullify
  has_many :items, through: :item_contents
  belongs_to :inventory, optional: true
end
