class Client < ApplicationRecord
  belongs_to :contact, optional:true
  has_many :event, dependent: :nullify
end
