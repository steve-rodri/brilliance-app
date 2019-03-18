class Inventory < ApplicationRecord
  has_many :contents, dependent: :nullify
end
