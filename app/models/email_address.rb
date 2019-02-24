class EmailAddress < ApplicationRecord
  belongs_to :contact, optional:true
  belongs_to :company, optional:true
  has_many :organizers, class_name: 'Event', foreign_key: 'organizer', dependent: :nullify
  has_many :creators, class_name: 'Event', foreign_key: 'creator', dependent: :nullify
end
