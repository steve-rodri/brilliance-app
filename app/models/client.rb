class Client < ApplicationRecord
  belongs_to :contact, optional:true
  belongs_to :company, optional:true
  has_many :event, dependent: :nullify

  accepts_nested_attributes_for :contact, :company
end
