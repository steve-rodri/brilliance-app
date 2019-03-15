class ExpenseSerializer < ActiveModel::Serializer
  attributes :id, :type, :amount, :reimbursement_type, :receipt, :paid, :notes
  has_one :employee
  has_one :event
end
