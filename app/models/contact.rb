class Contact < ApplicationRecord
  has_one :client, dependent: :nullify
end
