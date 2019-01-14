class Company < ApplicationRecord
  has_one :client, dependent: :nullify
  has_many :places, dependent: :nullify
end
