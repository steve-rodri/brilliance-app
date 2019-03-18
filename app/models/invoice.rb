class Invoice < ApplicationRecord
  belongs_to :event, optional: true
  has_many :lines, dependent: :destroy
  has_many :items, through: :lines
  accepts_nested_attributes_for :lines
end
