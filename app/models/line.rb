class Line < ApplicationRecord
  belongs_to :invoice
  belongs_to :item
end
