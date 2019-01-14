class Address < ApplicationRecord
  has_many :places, dependent: :nullify
end
