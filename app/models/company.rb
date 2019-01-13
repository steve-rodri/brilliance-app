class Company < ApplicationRecord
  has_one :client, dependent: :nullify
end
