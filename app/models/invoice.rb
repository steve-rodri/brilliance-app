class Invoice < ApplicationRecord
  belongs_to :event
  has_many :line
end
