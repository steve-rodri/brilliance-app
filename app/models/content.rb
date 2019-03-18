class Content < ApplicationRecord
  has_many :item_contents, dependent: :nullify
  belongs_to :inventory, optional: true
end
