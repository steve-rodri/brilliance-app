class EmailAddress < ApplicationRecord
  belongs_to :contact, optional:true
  belongs_to :company, optional:true
end
