class Place < ApplicationRecord
  belongs_to :company, optional:true
  belongs_to :address, optional:true
  has_many :events
end
