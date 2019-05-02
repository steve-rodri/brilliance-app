class Inventory < ApplicationRecord
  has_many :contents, dependent: :nullify
  has_one_attached :photo 
end
