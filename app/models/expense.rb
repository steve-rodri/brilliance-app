class Expense < ApplicationRecord
  belongs_to :employee, optional: true
  belongs_to :event, optional: true
end
